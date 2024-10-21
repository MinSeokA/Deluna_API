import { Injectable } from '@nestjs/common';
import { BlockedUser } from './entity/ban-user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Guilds } from 'src/guilds/entity/guilds.entity';
import { Result, success, fail } from 'src/utils/result';

@Injectable()
export class BanService {
  constructor(
    @InjectRepository(BlockedUser)
    private readonly blockedUsersRepository: Repository<BlockedUser>,
    @InjectRepository(Guilds)
    private readonly guildsRepository: Repository<Guilds>,
  ) {}

  private async isModerationBanEnabled(guildId: string): Promise<boolean> {
    const guild = await this.guildsRepository.findOne({ where: { guildId } });
    return guild?.moderationBan === true;
  }

  async blockUser(
    moderatorId: string,
    userId: string,
    guildId: string,
    reason?: string,
  ): Promise<Result<BlockedUser>> {
    if (!await this.isModerationBanEnabled(guildId)) {
      return fail('길드에서 차단 기능을 사용하지 않습니다.');
    }
    
    if (moderatorId === userId) {
      return fail('자신을 차단할 수 없습니다.');
    }

    const existingBlockedUser = await this.blockedUsersRepository.findOne({
      where: { moderatorId, userId, guildId },
    });

    if (existingBlockedUser) {
      return success('이미 차단된 사용자입니다.', existingBlockedUser);
    }

    const blockedUser = this.blockedUsersRepository.create({
      moderatorId,
      userId,
      guildId,
      reason: reason ? reason : "사유 없음",
    });

    return success('사용자를 성공적으로 차단했습니다.', await this.blockedUsersRepository.save(blockedUser));
  }

  async getBlockedUsers(guildId: string): Promise<Result<BlockedUser[]>> {
    if (!await this.isModerationBanEnabled(guildId)) {
      return fail('길드에서 차단 기능을 사용하지 않습니다.');
    }

    const blockedUsers = await this.blockedUsersRepository.find({ where: { guildId } });
    return success('차단된 사용자 목록을 가져왔습니다.', blockedUsers);
  }

  async unblockUser(moderatorId: string, userId: string, guildId: string): Promise<Result<void>> {
    if (!await this.isModerationBanEnabled(guildId)) {
      return fail('길드에서 차단 기능을 사용하지 않습니다.');
    }

    const deleteResult = await this.blockedUsersRepository.delete({ moderatorId, userId, guildId });

    if (deleteResult.affected === 0) {
      return fail('차단 해제할 사용자가 없습니다.');
    }

    return success('사용자를 성공적으로 차단 해제했습니다.');
  }
}

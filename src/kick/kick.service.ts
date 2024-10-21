import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KickedUser } from './entity/kick.entity';
import { KickDto } from './dto/kick.dto';
import { Result, success, fail } from 'src/utils/result';
import { Guilds } from 'src/guilds/entity/guilds.entity';

@Injectable()
export class KickService {
    constructor(
        @InjectRepository(KickedUser)
        private readonly kickedUsersRepository: Repository<KickedUser>,
        @InjectRepository(Guilds)
        private readonly guildsRepository: Repository<Guilds>,
    ) {}

    async kickUser(kickDto: KickDto): Promise<Result<KickedUser>> {
        const { moderatorId, userId, guildId, reason } = kickDto;

        // 해당 길드가 킥 기능을 지원하는지 확인
        const guild = await this.guildsRepository.findOne({ where: { guildId } });
        if (!guild || guild.system.moderationKick === false) {
            return fail('길드에서 추방 기능을 사용하지 않습니다.');
        }

        // 자기 자신을 킥할 수 없음
        if (moderatorId === userId) {
            return fail('자신을 추방할 수 없습니다.');
        }

        // 킥된 사용자 기록 생성
        const kickedUser = this.kickedUsersRepository.create({
            moderatorId,
            userId,
            guildId,
            reason,
        });

        // 킥된 사용자 기록 저장
        await this.kickedUsersRepository.save(kickedUser);

        return success('사용자를 성공적으로 킥했습니다.', kickedUser);
    }
}

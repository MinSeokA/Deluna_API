import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Guilds } from './entity/guilds.entity'; // Guild 엔티티 경로
import { GuildsDto } from './dto/create-guilds.dto'; // DTO 경로
import { success, fail, Result } from '../utils/result';
import { UpdateGuildsDto } from './dto/update-guilds.dto';

@Injectable()
export class GuildsService {
  constructor(
    @InjectRepository(Guilds)
    private readonly guildsRepository: Repository<Guilds>,
  ) {}

  async create(guild: GuildsDto): Promise<Result<Guilds>> {
    // 중복 처리: 길드 ID가 이미 존재하는지 확인
    const existingGuild = await this.guildsRepository.findOne({ where: { guildId: guild.guildId } });
    if (existingGuild) {
      return fail('이미 존재하는 길드입니다.', existingGuild);
    }

    try {
      const newGuild = this.guildsRepository.create(guild);

      await this.guildsRepository.save(newGuild);

      return success('새 길드를 성공적으로 생성했습니다.', newGuild);
    } catch (error) {
      return fail('새 길드를 생성하는 데 실패했습니다.');
    }
  }

  async getGuild(guildId: string): Promise<Result<Guilds>> {
    const guild = await this.guildsRepository.findOne({ where: { guildId } });

    if (!guild) {
      return fail('해당 ID의 길드를 찾을 수 없습니다.');
    }

    return success('성공적으로 길드를 가져왔습니다.', guild);
  }

  async getGuilds(): Promise<Result<Guilds[]>> {
    const guilds = await this.guildsRepository.find();

    return success('성공적으로 길드 목록을 가져왔습니다.', guilds);
  }

  async updateGuildSystem(updateGuildsDto: UpdateGuildsDto): Promise<Result<Guilds>> {
    const { guildId, system, status } = updateGuildsDto;

    const guild = await this.guildsRepository.findOne({ where: { guildId: guildId } });

    if (!guild) {
      return fail('길드를 찾을 수 없습니다.');
    }

    // 기능 업데이트 로직
    switch (system) {
      case 'warn':
        guild.system.moderationWarn = status; // 예: moderationWarn 필드가 있다고 가정
        break;
      case 'ban':
        guild.system.moderationBan = status;
        break;
      case 'kick':
        guild.system.moderationKick = status;
        break;
      default:
        return fail('잘못된 기능입니다.');
    }

    await this.guildsRepository.save(guild);
    return success('기능이 성공적으로 업데이트되었습니다.', guild);
  }
}

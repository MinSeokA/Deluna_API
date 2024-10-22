import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Guilds } from './entity/guilds.entity'; // Guild 엔티티 경로
import { GuildsDto } from './dto/Guilds.dto'; // DTO 경로
import { success, fail, Result } from '../utils/result';
import { SystemDto } from './dto/System.dto';
import { System } from './entity/system.entity';
import { SystemLogs } from './entity/logging.entity';
import { LogChannels } from './entity/channels.entity';
import { Economy } from 'src/economy/entity/economy.entity';

@Injectable()
export class GuildsService {
  constructor(
    @InjectRepository(Guilds)
    private readonly guildsRepository: Repository<Guilds>,

    @InjectRepository(System)
    private readonly systemsRepository: Repository<System>,

    @InjectRepository(SystemLogs)
    private readonly systemLogsRepository: Repository<SystemLogs>,

    @InjectRepository(LogChannels)
    private readonly channelsRepository: Repository<LogChannels>,

    @InjectRepository(Economy)
    private readonly economyRepository: Repository<Economy>,
  ) {}

  async create(guild: GuildsDto): Promise<Result<Guilds>> {
    // 중복 처리: 길드 ID가 이미 존재하는지 확인
    const existingGuild = await this.guildsRepository.findOne({ where: { guildId: guild.guildId } });
    if (existingGuild) {
      return fail('이미 존재하는 길드입니다.', existingGuild);
    }

    try {
        // 새로운 길드 생성
        const newGuild = this.guildsRepository.create({
          guildId: guild.guildId,
          ownerId: guild.ownerId,
          prefix: guild.prefix,
      });

      // 길드 저장
      await this.guildsRepository.save(newGuild);

      // 시스템 정보 생성
      const newSystem = this.systemsRepository.create({
        guilds: newGuild, // 새로운 길드와 연결
        moderationWarn: false,
        moderationKick: false,
        moderationBan: false,
        economy: false,
        leave: false,
        welcome: false,
        logging: false,
      });

      await this.systemsRepository.save(newSystem);

      // 시스템 로그 생성
      const newSystemLog = this.systemLogsRepository.create({
        guilds: newGuild, // 새로운 길드와 연결
        warn: false,
        kick: false,
        ban: false,
        economy: false,
      });

      await this.systemLogsRepository.save(newSystemLog);

      // 채널 정보 생성
      const newChannel = this.channelsRepository.create({
        guilds: newGuild, // 새로운 길드와 연결
        welcomeChannel: null,
        leaveChannel: null,
        logsChannel: null,
      });

      await this.channelsRepository.save(newChannel);

      console.log(newGuild);
      return success('새 길드를 성공적으로 생성했습니다.', newGuild);
    } catch (error) {
      console.error(error);
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

  async update(guildId: string, updateData: any): Promise<Result<Guilds>> {
    // 길드 찾기
    const guild = await this.guildsRepository.findOne({
      where: { guildId: guildId },
      relations: ['systems', 'systemLogs', 'channels'],
    });
    
    if (!guild) {
      return fail('길드를 찾을 수 없습니다.');
    }


    // 업데이트 데이터 처리
    if (updateData?.system) {
      const system = guild.systems[0];

      switch (updateData.system.feature) {
        case 'moderationWarn':
          system.moderationWarn = updateData.system.status;
          break;
        case 'moderationKick':
          system.moderationKick = updateData.system.status;
          break;
        case 'moderationBan':
          system.moderationBan = updateData.system.status;
          break;
        case 'economy':
          system.economy = updateData.system.status;
          break;
        case 'leave':
          system.leave = updateData.system.status;
          break;
        case 'welcome':
          system.welcome = updateData.system.status;
          break;
        case 'logging':
          system.logging = updateData.system.status;
          break;
        default:
          return fail('올바르지 않은 시스템 기능입니다.');
      }

      // 변경된 데이터 저장
      await this.systemsRepository.save(system);
    }

    if (updateData?.log) {
      const systemLog = guild.systemLogs[0];

      switch (updateData.log.feature) {
        case 'warn':
          systemLog.warn = updateData.log.status;
          break;
        case 'kick':
          systemLog.kick = updateData.log.status;
          break;
        case 'ban':
          systemLog.ban = updateData.log.status;
          break;
        case 'economy':
          systemLog.economy = updateData.log.status;
          break;
        default:
          return fail('올바르지 않은 로깅 기능입니다.');
      }

      // 변경된 데이터 저장
      await this.systemLogsRepository.save(systemLog);
    }

    if (updateData?.channel) {
      const channel = guild.channels[0];

      switch (updateData.channel.feature) {
        case 'welcomeChannel':
          channel.welcomeChannel = updateData.channel.id;
          break;
        case 'leaveChannel':
          channel.leaveChannel = updateData.channel.id;
          break;
        case 'logsChannel':
          channel.logsChannel = updateData.channel.id;
          break;
        default:
          return fail('올바르지 않은 채널 기능입니다.');
      }

      // 변경된 데이터 저장
      await this.channelsRepository.save(channel);
    }  
    // 변경된 데이터 저장
    await this.guildsRepository.save(guild);

    return success('길드 정보가 성공적으로 업데이트되었습니다.', guild);
  }
}

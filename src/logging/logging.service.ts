import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logging } from './entity/logging.entity';
import { Result, success, fail } from '../utils/result';

@Injectable()
export class LoggingService {
  constructor(
    @InjectRepository(Logging)
    private readonly loggingRepository: Repository<Logging>,
  ) {}

  async createLogging(guildId: string): Promise<Result<Logging>> {
    const logging = this.loggingRepository.create({
      guildId,
      settings: {
        loggingEnabled: false,
        loggingChannelId: null,
        economyLogs: {
          isEnabled: false,
          channelId: null,
        },
        moderationLogs: {
          isEnabled: false,
          channelId: null,
        },
      },
      economyLogs: {
        deposits: [],
        withdrawals: [],
        transfers: [],
        shops: [],
      },
      moderationLogs: {
        bans: [],
        kicks: [],
        warns: [],
      },
    });

    const savedLogging = await this.loggingRepository.save(logging);
    return success('길드 로그가 성공적으로 생성되었습니다.', savedLogging);
  }

  async getLogging(guildId: string): Promise<Result<Logging>> {
    const logging = await this.loggingRepository.findOne({
      where: { guildId },
    });
    if (!logging) {
      return fail(`길드에 대한 로그(을)를 찾을 수 없습니다.: ${guildId}`);
    }
    return success('로그(이)가 성공적으로 검색되었습니다.', logging);
  }

  async updateLogging(
    guildId: string,
    updates: Partial<Logging>,
  ): Promise<Result<Logging>> {
    const loggingResult = await this.getLogging(guildId);
    if (!loggingResult.status) {
      return loggingResult;
    }

    const logging = loggingResult.data!;

    // 설정 업데이트
    if (updates.settings) {
      logging.settings = { ...logging.settings, ...updates.settings };
    }

    // 경제 로그 업데이트
    if (updates.economyLogs) {
      logging.economyLogs = { ...logging.economyLogs, ...updates.economyLogs };
    }

    // 관리 로그 업데이트
    if (updates.moderationLogs) {
      logging.moderationLogs = {
        ...logging.moderationLogs,
        ...updates.moderationLogs,
      };
    }

    const updatedLogging = await this.loggingRepository.save(logging);
    return success('로그(이)가 성공적으로 업데이트되었습니다.', updatedLogging);
  }

  async setLogging(
    guildId: string,
    enabled: boolean,
    channelId?: string,
  ): Promise<Result<Logging>> {
    try {
      return await this.updateLogging(guildId, {
        settings: {
          loggingEnabled: enabled,
          loggingChannelId: enabled ? channelId : null,
        },
      });
    } catch (error) {
      console.error('Failed to set logging:', error);
      return fail('로그 설정 중 오류가 발생했습니다.');
    }
  }

  async enableLogging(
    guildId: string,
    channelId: string,
  ): Promise<Result<Logging>> {
    try {
      const loggingResult = await this.getLogging(guildId);
      if (loggingResult.status && loggingResult.data?.settings.loggingEnabled) {
        return fail('길드에 대한 로그(이)가 이미 활성화되어 있습니다.');
      }
      return await this.setLogging(guildId, true, channelId);
    } catch (error) {
      console.error('Failed to enable logging:', error);
      return fail('로그를 활성화하는 중 오류가 발생했습니다.');
    }
  }

  async disableLogging(guildId: string): Promise<Result<Logging>> {
    try {
      const loggingResult = await this.getLogging(guildId);
      if (
        loggingResult.status &&
        !loggingResult.data?.settings.loggingEnabled
      ) {
        return fail('길드에 대한 로그(이)가 이미 비활성화되어 있습니다.');
      }
      return await this.setLogging(guildId, false);
    } catch (error) {
      console.error('Failed to disable logging:', error);
      return fail('로그를 비활성화하는 중 오류가 발생했습니다.');
    }
  }

  async createEconomyLog(
    guildId: string,
    logType: '입금' | '출금' | '이체' | '상점',
    logData: {
      userId: string;
      amount?: number;
      itemId?: string;
      name?: string;
    },
  ): Promise<Result<Logging>> {
    const loggingResult = await this.getLogging(guildId);
    if (!loggingResult.status) {
      return loggingResult;
    }
  
    const logging = loggingResult.data!;
  
    // economyLogs 객체가 없으면 초기화
    if (!logging.economyLogs) {
      logging.economyLogs = {};
    }
  
    // 특정 logType 배열이 없으면 초기화
    if (!logging.economyLogs[logType]) {
      logging.economyLogs[logType] = [];
    }
  
    // 새로운 로그 엔트리 생성
    const logEntry = {
      logType,
      ...logData,
      createdAt: new Date(),
    };
  
    // 로그 추가
    logging.economyLogs[logType].push(logEntry);
  
    // 로그 저장
    const updatedLogging = await this.loggingRepository.save(logging);
    return success('경제 로그가 성공적으로 추가되었습니다.', updatedLogging);
  }
  
  async createModerationLog(guildId: string, logType: '차단' | '추방' | '경고', logData: { moderatorId: string; userId: string; reason: string; warnId?: string; }): Promise<Result<Logging>> {
    const loggingResult = await this.getLogging(guildId);
    if (!loggingResult.status) {
        return loggingResult;
    }

    const logging = loggingResult.data!;

    // moderationLogs가 정의되어 있지 않으면 초기화
    if (!logging.moderationLogs) {
        logging.moderationLogs = {
            bans: [],
            kicks: [],
            warns: []
        };
    }

    // 새로운 로그 엔트리 생성
    const logEntry: any = {
        createdAt: new Date(),
        byUserId: logData.moderatorId,
        userId: logData.userId,
        reason: logData.reason,
    };

    // logType에 따라 logEntry의 타입을 설정
    if (logType === '경고') {
        logEntry.warnId = logData.warnId; // 경고일 경우 warnId 추가
    }
    logEntry.logType = logType; // logType 추가

    // 로그 유형에 따라 적절한 배열에 추가
    switch (logType) {
        case '차단':
            logging.moderationLogs.bans.push(logEntry); // '차단'에 대한 로그 추가
            break;
        case '추방':
            logging.moderationLogs.kicks.push(logEntry); // '추방'에 대한 로그 추가
            break;
        case '경고':
            logging.moderationLogs.warns.push(logEntry); // '경고'에 대한 로그 추가
            break;
        default:
            return fail('올바르지 않은 로그 유형입니다.');
    }

    // 로그 저장
    const updatedLogging = await this.loggingRepository.save(logging);
    return success('관리 로그가 성공적으로 추가되었습니다.', updatedLogging);
}

}

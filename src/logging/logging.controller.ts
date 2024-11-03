import { Controller, Post, Get, Param, Body, Put, HttpCode, HttpStatus } from '@nestjs/common';
import { LoggingService } from './logging.service';
import { Logging } from './entity/logging.entity';
import { Result } from 'src/utils/result';

@Controller('logging')
export class LoggingController {
    constructor(private readonly loggingService: LoggingService) {}

    @Post(':guildId')
    @HttpCode(HttpStatus.CREATED)
    async createLogging(@Param('guildId') guildId: string): Promise<Result<Logging>> {
        return this.loggingService.createLogging(guildId);
    }

    @Get(':guildId')
    @HttpCode(HttpStatus.OK)
    async getLogging(@Param('guildId') guildId: string): Promise<Result<Logging>> {
        return this.loggingService.getLogging(guildId);
    }

    @Put(':guildId')
    @HttpCode(HttpStatus.OK)
    async updateLogging(
        @Param('guildId') guildId: string,
        @Body() updates: Partial<Logging>, // 타입 지정
    ): Promise<Result<Logging>> {
        return this.loggingService.updateLogging(guildId, updates);
    } 

    @Put(':guildId/enable') // PUT 메서드 사용
    @HttpCode(HttpStatus.OK)
    async enableLogging(
        @Param('guildId') guildId: string,
        @Body('channelId') channelId: string,
    ): Promise<Result<Logging>> {
        return this.loggingService.enableLogging(guildId, channelId);
    }

    @Put(':guildId/disable') // PUT 메서드 사용
    @HttpCode(HttpStatus.OK)
    async disableLogging(@Param('guildId') guildId: string): Promise<Result<Logging>> {
        return this.loggingService.disableLogging(guildId);
    }

    @Post(':guildId/economy-log') // 경제 로그 추가
    @HttpCode(HttpStatus.OK)
    async createEconomyLog(
        @Param('guildId') guildId: string,
        @Body() logData: { logType: '입금' | '출금' | '이체' | '상점'; userId: string; amount?: number; itemId?: string; name?: string; },
    ): Promise<Result<Logging>> {
        return this.loggingService.createEconomyLog(guildId, logData.logType, logData);
    }

    @Post(':guildId/moderation-log') // 관리 로그 추가
    @HttpCode(HttpStatus.OK)
    async createModerationLog(
        @Param('guildId') guildId: string,
        @Body() logData: { logType: '차단' | '추방' | '경고'; moderatorId: string; userId: string; reason: string; warnId?: string; },
    ): Promise<Result<Logging>> {
        return this.loggingService.createModerationLog(guildId, logData.logType, logData);
    }
}

import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { EconomyService } from './economy.service';

@Controller('economy')
export class EconomyController {
    constructor(
        private readonly economyService: EconomyService,
    ) {}

    // 잔액 조회
    @Get('balance/:guildId/:userId')
    async getBalance(
        @Param('guildId') guildId: string,
        @Param('userId') userId: string,
    ): Promise<any> {
        return this.economyService.getBalance(userId, guildId);
    }

    // 길드 사용자 잔액 조회
    @Get('balances/:guildId')
    async getBalances(
        @Param('guildId') guildId: string
    ): Promise<any> {
        return this.economyService.getBalances(guildId);
    }

    // 이체
    @Post('transfer')
    async transferBalance(
        @Body() body: { senderId: string, receiverId: string, guildId: string, amount: number }
    ): Promise<any> {
        return this.economyService.transferBalance(body.senderId, body.receiverId, body.guildId, body.amount);
    }

    // 출금
    @Post('withdraw')
    async withdrawBalance(
        @Body() body: { userId: string, guildId: string, amount: number }
    ): Promise<any> {
        return this.economyService.withdrawBalance(body.userId, body.guildId, body.amount);
    }

    // 입금
    @Post('deposit')
    async depositBalance(
        @Body() body: { userId: string, guildId: string, amount: number }
    ): Promise<any> {
        return this.economyService.depositBalance(body.userId, body.guildId, body.amount);
    }

    // 잔액 설정
    @Post('setBalance')
    async setBalance(
        @Body() body: { userId: string, guildId: string, amount: number }
    ): Promise<any> {
        return this.economyService.setBalance(body.userId, body.guildId, body.amount);
    }

    // 은행 잔액 설정
    @Post('setBank')
    async setBank(
        @Body() body: { userId: string, guildId: string, amount: number }
    ): Promise<any> {
        return this.economyService.setBank(body.userId, body.guildId, body.amount);
    }

    // 상위권 조회
    @Get('leaderboard/:guildId/:limit')
    async getLeaderboard(
        @Param('guildId') guildId: string,
        @Param('limit') limit: number
    ): Promise<any> {
        return this.economyService.getTopBalances(guildId, limit);
    }


    // 길드 잔액 초기화
    @Post('resetAllBalances')
    async resetAllBalances(
        @Body() body: { guildId: string }
    ): Promise<any> {
        return this.economyService.resetEconomy(body.guildId);
    }


    // 사용자 잔액 초기화
    @Post('setUserBalance')
    async setUserBalance(
        @Body() body: { userId: string, guildId: string }
    ): Promise<any> {
        return this.economyService.resetUserBank(body.userId, body.guildId);
    }

    // 사용자 은행 잔액 초기화
    @Post('setUserBank')
    async setUserBank(
        @Body() body: { userId: string, guildId: string }
    ): Promise<any> {
        return this.economyService.resetUserBank(body.userId, body.guildId);
    }

    // 전체 초기화
    @Post('resetAll')
    async resetAll(): Promise<any> {
        return this.economyService.resetAllEconomies();
    }

    // 출석체크
    @Get('checkIn/:guildId/:userId')
    async checkIn(
        @Param('guildId') guildId: string,
        @Param('userId') userId: string
    ): Promise<any> {
        return this.economyService.checkIn(userId, guildId);
    }

    // 출석체크 보상 설정
    @Post('setCheckInReward')
    async setCheckInReward(
        @Body() body: { guildId: string, amount: number }
    ): Promise<any> {
        return this.economyService.setCheckInReward(body.guildId, body.amount);
    }
}

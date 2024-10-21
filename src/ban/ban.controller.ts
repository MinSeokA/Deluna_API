import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BanService } from './ban.service';

@Controller('ban')
export class BanController {
  constructor(
    private readonly banService: BanService,
  ) {}
  @Post('user')
  async blockUser(@Body() body: { blockerId: string, blockedId: string, guildId: string, reason?: string }): Promise<any> {
    return this.banService.blockUser(body.blockerId, body.blockedId, body.guildId, body.reason);
  }

  @Get('users/:guildId')
  async getBlockedUsers(
    @Param() guildId: string,
  ): Promise<any> {
    return this.banService.getBlockedUsers(guildId);
  }

  @Post('user/remove')
  async unblockUser(
    @Body() body: { 
      guildId: string, 
      userId: string,
      moderatorId: string,
    },
  ): Promise<any> {
    return this.banService.unblockUser(body.guildId, body.userId);
  }

  @Post("users/removeAll")
  async unblockAllUsers(
    @Body() body: { guildId: string, moderatorId: string },
  ): Promise<any> {
    return this.banService.unblockAllUsers(body.guildId);
  }
}

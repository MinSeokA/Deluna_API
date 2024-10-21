import { Body, Controller, Post } from '@nestjs/common';
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
}

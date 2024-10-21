import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { WarnService } from './warn.service';
import { Warn } from './entity/warn.entity';
import WarnDto from './dto/warn.dto';
import { Result } from 'src/utils/result';

@Controller('warn')
export class WarnController {
  constructor(private readonly warnService: WarnService) {}

  // 경고 추가
  @Post('add')
  async addWarn(@Body() warn: WarnDto): Promise<Result<Warn>> {
    return this.warnService.addWarn(warn);
  }

  // 전체 경고 목록 가져오기
  @Get('list')
  async getWarns(): Promise<Result<Warn[]>> {
    return this.warnService.getWarns();
  }

  // 특정 길드의 경고 목록 가져오기
  @Get('list/guild/:guildId')
  async getWarnsByGuild(@Param('guildId') guildId: string): Promise<Result<Warn[]>> {
    return this.warnService.getWarnsByGuild(guildId);
  }

  // 특정 유저의 경고 기록 가져오기
  @Get('user/:guildId/:userId')
  async getWarnUser(
    @Param('userId') userId: string,
    @Param('guildId') guildId: string
  ): Promise<Result<Warn[]>> {
    return this.warnService.getWarnUser(userId, guildId);
  }

  // 경고 삭제
  @Post('delete/:userId/:warnId')
  async deleteWarn(
    @Param('userId') userId: string,
    @Param('warnId') warnId: string
    ): Promise<Result<Warn>> {
    return this.warnService.deleteWarn(userId, warnId);
  }
}

import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GuildsService } from './guilds.service';
import { Guilds } from './entity/guilds.entity';
import { GuildsDto } from './dto/Guilds.dto';
import { Result } from 'src/utils/result';

@Controller('guilds')
export class GuildsController {
  constructor(
    private readonly guildsService: GuildsService,
  ) {}
    
  @Post("create")
  async create(@Body() guild: GuildsDto): Promise<Result<Guilds>> {
    return this.guildsService.create(guild);
  }

  @Get(":guildId")
  async getGuild(@Param("guildId") guildId: string): Promise<Result<Guilds>> {
    return this.guildsService.getGuild(guildId);
  }
  @Get("list")
  async getGuilds(): Promise<Result<Guilds[]>> {
    return this.guildsService.getGuilds();
  }

  @Post(':guilId/update')
  async updateGuild(
    @Param("guildId") guildId: string,
    @Body() body: {
    updateData: Partial<GuildsDto>; // 업데이트할 데이터
  }): Promise<Result<Guilds>> {
    return this.guildsService.update(guildId, body.updateData);
  }
  
}

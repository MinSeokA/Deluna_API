import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GuildsService } from './guilds.service';
import { Guilds } from './entity/guilds.entity';
import { GuildsDto } from './dto/create-guilds.dto';
import { Result } from 'src/utils/result';
import { UpdateGuildsDto } from './dto/update-guilds.dto';

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

  @Post('update')
  async updateGuild(@Body() updateGuildDto: UpdateGuildsDto): Promise<Result<any>> {
    return await this.guildsService.updateGuildSystem(updateGuildDto);
  }
}

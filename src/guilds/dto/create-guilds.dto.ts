// guilds dto
// Compare this snippet from src/guilds/dto/guilds.dto.ts:
import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class GuildsDto {
  @IsString()
  guildId: string;

  @IsString()
  ownerId: string;

  @IsString()
  prefix: string;

  @IsBoolean()
  welcome: boolean;

  @IsBoolean()
  leave: boolean;

  @IsBoolean()
  ban: boolean;

  @IsBoolean()
  kick: boolean;

  @IsBoolean()
  warn: boolean;

  @IsBoolean()
  all: boolean;

  @IsBoolean()
  warnLogs: boolean;

  @IsBoolean()
  kickLogs: boolean;

  @IsBoolean()
  banLogs: boolean;

  @IsString()
  welcomeChannel: string;

  @IsString()
  leaveChannel: string;

  @IsString()
  logsChannel: string;
}



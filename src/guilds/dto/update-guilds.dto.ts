import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UpdateGuildsDto {
  @IsNotEmpty()
  @IsString()
  guildId: string;

  @IsNotEmpty()
  @IsString()
  system: string;

  @IsBoolean()
  status: boolean;
}

import { GuildsDto } from "./Guilds.dto";

export class LoggingDto {
  id: number;
  warn: boolean;
  kick: boolean;
  ban: boolean;
  economy: boolean;
  guilds: GuildsDto;
}
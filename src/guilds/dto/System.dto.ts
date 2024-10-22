import { GuildsDto } from "./Guilds.dto";

export class SystemDto {
  id: number;
  warn: boolean;
  kick: boolean;
  ban: boolean;
  economy: boolean;
  guilds: GuildsDto;
}
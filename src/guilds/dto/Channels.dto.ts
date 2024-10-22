import { GuildsDto } from './Guilds.dto';

export class ChannelsDto {
  welcomeChannel: string | null;

  leaveChannel: string | null;

  logsChannel: string | null;

  id: number;
  
  guilds: GuildsDto;
}

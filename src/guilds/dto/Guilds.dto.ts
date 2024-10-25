import { SystemDto } from "./System.dto";
import { LogChannels } from './../entity/channels.entity';

export class GuildsDto {
  guildId: string;
  prefix: string;
  ownerId: string;
  
  // 여기에 시스템 관련 필드 추가
  systems?: SystemDto[]; // 또는 필요한 다른 속성들
  channels?: LogChannels[];
}

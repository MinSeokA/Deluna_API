import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { Logging } from '../logging.entity';
import { EconomyLog } from '../economy/economy-log.entity';
import { ModerationLog } from '../moderaction/moderation-log.entity';

// 길드 로그
@Entity('log_guilds_channel')
export class LogGuildsChannel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    LogType: "채널";

    @Column()
    guildId: string;

    @Column()
    loggingEnabled: boolean;

    @ManyToOne(() => Logging, (logging) => logging.channel)
    logging: Logging;

    @OneToMany(() => EconomyLog, (economyLog) => economyLog.logging)
    economyLogs: EconomyLog[];
  
    @OneToMany(() => ModerationLog, (moderationLog) => moderationLog.logging)
    moderationLogs: ModerationLog[];
  
  
    
}
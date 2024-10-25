import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Logging } from '../logging.entity';
import { LogGuildsChannel } from '../guilds/channel.entity';

@Entity('moderation_log')
export class ModerationLog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    guildId: string;

    @Column({ nullable: true })
    logBanChannelId: string;

    @Column({ nullable: true })
    logKickChannelId: string;

    @Column({ nullable: true })
    logWarnChannelId: string;

    @ManyToOne(() => LogGuildsChannel, (logging) => logging.moderationLogs)
    logging: Logging;
}

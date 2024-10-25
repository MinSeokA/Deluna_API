import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Logging } from '../logging.entity';
import { LogGuildsChannel } from '../guilds/channel.entity';

@Entity('economy_log')
export class EconomyLog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    guildId: string;

    @Column({ nullable: true })
    logShopChannelId: string;

    @Column({ nullable: true })
    logDepositChannelId: string;

    @Column({ nullable: true })
    logWithdrawChannelId: string;

    @Column({ nullable: true })
    logTransferChannelId: string;

    @ManyToOne(() => LogGuildsChannel, (logging) => logging.economyLogs)
    logging: Logging;
}

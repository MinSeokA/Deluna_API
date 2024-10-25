import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne, OneToMany } from 'typeorm';
import { Deposit } from './economy/deposit.entity';
import { Withdraw } from './economy/withdraw.entity';
import { Transfer } from './economy/transfer.entity';
import { LogShops } from './economy/items.entity';
import { LogGuildsChannel } from './guilds/channel.entity';
import { EconomyLog } from './economy/economy-log.entity';
import { ModerationLog } from './moderaction/moderation-log.entity';
import { Logban } from './moderaction/ban.entity';
import { LogKick } from './moderaction/kick.entity';
import { LogWarn } from './moderaction/warn.entity';

// 로그 설정
@Entity('logging')
export class Logging {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  guildId: string;

  @Column()
  createdAt: Date;

  // logging channel and boolean
  @OneToOne(() => LogGuildsChannel, (channel) => channel.logging)
  channel: LogGuildsChannel;

  @ManyToOne(() => Deposit, (deposit) => deposit.logging)
  deposit: Deposit[];

  @ManyToOne(() => Withdraw, (withdraw) => withdraw.logging)
  withdraw: Withdraw[];

  @ManyToOne(() => Transfer, (transfer) => transfer.logging)
  transfer: Transfer[];

  @ManyToOne(() => LogShops, (shops) => shops.logging)
  shops: LogShops[];

  @ManyToOne(() => Logban, (ban) => ban.logging)
  ban: Logban[];

  @ManyToOne(() => LogKick, (kick) => kick.logging)
  kick: Logban[];

  @ManyToOne(() => LogWarn, (warn) => warn.logging)
  warn: Logban[];

}
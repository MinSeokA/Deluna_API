import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('logging')
export class Logging {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  guildId: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  settings: {
    loggingEnabled?: boolean;
    loggingChannelId?: string;
    economyLogs?: {
      isEnabled?: boolean;
      channelId?: number;
    };
    moderationLogs?: {
      isEnabled?: boolean;
      channelId?: number;
    };
  };

  @Column({ type: 'jsonb', nullable: true })
  economyLogs: {
    deposits?: Array<{ logType: "입금"; userId: string; amount: number; createdAt: Date; }>;
    withdrawals?: Array<{ logType: "출금"; userId: string; amount: number; createdAt: Date; }>;
    transfers?: Array<{ logType: "이체"; fromUserId: string; toUserId: string; amount: number; createdAt: Date; }>;
    shops?: Array<{ logType: "상점"; itemId: string; name: string; price: number; buyUserId: string; createdAt: Date; }>;
  };

  @Column({ type: 'jsonb', nullable: true })
  moderationLogs: {
    bans?: Array<{ logType: "차단"; byUserId: string; userId: string; reason: string; createdAt: Date; }>;
    kicks?: Array<{ logType: "추방"; byUserId: string; userId: string; reason: string; createdAt: Date; }>;
    warns?: Array<{ logType: "경고"; byUserId: string; userId: string; warnId: string; reason: string; createdAt: Date; }>;
  };
}

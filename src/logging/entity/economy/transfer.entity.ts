import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Logging } from '../logging.entity';

// 이체 로그
@Entity('log_transfer')
export class Transfer {
  @PrimaryGeneratedColumn()
  id: number;

  @ Column()
  LogType: "이체";

  @Column()
  fromUserId: string;

  @Column()
  toUserId: string;

  @Column()
  amount: number;

  @Column()
  createdAt: Date;

  @ManyToOne(() => Logging, (logging) => logging.transfer)
  logging: Logging
}
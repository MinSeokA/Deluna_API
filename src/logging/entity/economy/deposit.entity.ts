import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Logging } from '../logging.entity';

// 입금 로그
@Entity('log_deposit')
export class Deposit {
  @PrimaryGeneratedColumn()
  id: number;

  @ Column()
  LogType: "입금";

  @Column()
  userId: string;

  @Column()
  amount: number;

  @Column()
  createdAt: Date;

  @ManyToOne(() => Logging, (logging) => logging.deposit)
  logging: Logging;
}

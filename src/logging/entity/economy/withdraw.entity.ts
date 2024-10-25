import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Logging } from '../logging.entity';

// 출금 로그
@Entity('log_withdraw')
export class Withdraw {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  LogType: "출금";

  @Column()
  userId: string;

  @Column()
  amount: number;

  @Column()
  createdAt: Date;

  @ManyToOne(() => Logging, (logging) => logging.withdraw)
  logging: Logging;
}

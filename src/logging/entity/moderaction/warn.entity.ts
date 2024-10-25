import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Logging } from '../logging.entity';

// 경고 로그
@Entity('log_warn')
export class LogWarn {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    LogType: "경고";

    @Column()
    byUserId: string;

    @Column()
    warnId: string;

    @Column()
    userId: string;

    @Column()
    reason: string;

    @Column()
    createdAt: Date;

    @ManyToOne(() => Logging, (logging) => logging.warn)
    logging: Logging;
}
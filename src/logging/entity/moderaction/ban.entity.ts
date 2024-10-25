import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Logging } from '../logging.entity';

// 밴 로그
@Entity('log_ban')
export class Logban {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    LogType: "차단";

    @Column()
    byUserId: string;

    @Column()
    userId: string;

    @Column()
    reason: string;

    @Column()
    createdAt: Date;

    @ManyToOne(() => Logging, (logging) => logging.ban)
    logging: Logging;
}
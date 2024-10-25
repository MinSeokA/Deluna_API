import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Logging } from '../logging.entity';

@Entity('log_kick')
export class LogKick {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    LogType: "킥";

    @Column()
    byUserId: string;

    @Column()
    userId: string;

    @Column()
    reason: string;

    @Column()
    createdAt: Date;

    @ManyToOne(() => Logging, (logging) => logging.kick)
    logging: Logging;
}

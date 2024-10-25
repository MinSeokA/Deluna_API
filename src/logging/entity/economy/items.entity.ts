import  { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Logging } from '../logging.entity';

// 상점 로그
@Entity('log_items')
export class LogShops {
    @PrimaryGeneratedColumn()
    id: number;

    @ Column()
    LogType: "상점";

    @Column()
    itemId: string;

    @Column()
    name: string;

    @Column()
    price: number;

    @Column()
    buyUserId: string;

    @Column()
    createdAt: Date;

    @ManyToOne(() => Logging, (logging) => logging.shops)
    logging: Logging;
}
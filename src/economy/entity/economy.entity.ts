import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Shop } from './shop.entity';
import { Jobs } from './jobs.entity';
import { Inventory } from './inventory.entity';


@Entity("economy")
export class Economy {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: string;

    @Column()
    balance: number;

    @Column({
        default: 5000
    })
    bank: number;

    // 출석체크 마지막 시간 확인
    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    DailyCheckInTime: Date;

    // 인벤토리
    @ManyToOne(() => Inventory, (inventory) => inventory.economy)
    inventory: Inventory[];


    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

}

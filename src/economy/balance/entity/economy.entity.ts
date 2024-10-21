import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
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
    guildId: string;

    @Column()
    balance: number;

    @Column({
        default: 5000
    })
    bank: number;

    // 인벤토리
    @ManyToMany(() => Inventory, (inventory) => inventory.economy)
    inventory: Inventory;

    // 직업
    @ManyToMany(() => Jobs, (job) => job.economy)
    job: Jobs;

    // 상점
    @ManyToMany(() => Shop, (shop) => shop.economy)
    shop: Shop;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

}

import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Shop } from './shop.entity';

@Entity('items')
export class Item {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    itemId: string;

    @Column()
    name: string;

    @Column()
    price: number;

    @Column()
    stock: number;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    // Shop 연결
    @ManyToOne(() => Shop, (shop) => shop.items)
    shop: Shop;
}
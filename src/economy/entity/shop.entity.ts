import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, ManyToOne } from 'typeorm';
import { Economy } from './economy.entity';
import { Item } from './item.entity';

@Entity('shop')
export class Shop {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    // items 연결
    @ManyToOne(() => Item, (item) => item.shop)
    items: Item[];

    @ManyToOne(() => Economy, (economy) => economy.shop)
    economy: Economy;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}
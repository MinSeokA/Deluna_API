import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Economy } from './economy.entity';

@Entity('shop')
export class Shop {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    itemId: string;

    @Column()
    name: string;

    @Column()
    price: number;

    @Column()
    description: string;

    @Column()
    image: string;

    @Column()
    type: string;

    @Column()
    stock: number;

    @Column()
    isLimited: boolean;

    @ManyToMany(() => Economy, (economy) => economy.shop)
    economy: Economy;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}
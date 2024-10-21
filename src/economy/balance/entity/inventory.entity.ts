import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Economy } from './economy.entity';

@Entity('inventory')
export class Inventory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: string;

    @Column()
    item: string;

    @Column()
    amount: number;

    @ManyToOne(() => Economy, (economy) => economy.inventory)
    economy: Economy;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}
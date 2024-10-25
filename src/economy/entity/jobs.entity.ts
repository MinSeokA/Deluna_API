import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Economy } from './economy.entity';

@Entity('jobs')
export class Jobs {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    salary: number;

    @Column()
    level: number;

    @Column()
    experience: number;

    @ManyToMany(() => Economy, (economy) => economy.shop)
    economy: Economy;

    @Column()
    isLimited: boolean;

    @Column()
    type: string;

    @Column()
    stock: number;

    @Column()
    image: string;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
} 



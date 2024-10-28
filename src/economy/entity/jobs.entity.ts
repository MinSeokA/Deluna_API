import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { EconomyGuild } from './economy-guild.entity';

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

    // 여러 EconomyGuild가 같은 직업을 가질 수 있음 (Many-to-One)
    @OneToMany(() => EconomyGuild, (economyGuild) => economyGuild.job)
    economyGuild: EconomyGuild;

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

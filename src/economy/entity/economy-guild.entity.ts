import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Shop } from './shop.entity';
import { Jobs } from './jobs.entity';

@Entity("economy-guild")
export class EconomyGuild {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    guildId: string;

    @Column()
    checkInReward: number;

    // 직업 (Many-to-One: 여러 Guild가 하나의 Job을 가질 수 있음)
    @OneToMany(() => Jobs, (job) => job.economyGuild)
    job: Jobs[];

    // 상점 (One-to-One 관계)
    @OneToOne(() => Shop)
    @JoinColumn()
    shop: Shop;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}

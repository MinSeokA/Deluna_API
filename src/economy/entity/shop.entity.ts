import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne } from 'typeorm';
import { Item } from './item.entity';
import { EconomyGuild } from './economy-guild.entity';

@Entity('shop')
export class Shop {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    // 여러 Item이 한 Shop에 속할 수 있음 (One-to-Many)
    @OneToMany(() => Item, (item) => item.shop)
    items: Item[];

    // 상점은 EconomyGuild에 속함 (One-to-One)
    @OneToOne(() => EconomyGuild, (economyGuild) => economyGuild.shop)
    economyGuild: EconomyGuild;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}

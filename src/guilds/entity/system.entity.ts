import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Guilds } from './guilds.entity';

@Entity('system')
export class System {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Guilds, (guild) => guild.systems)
    guilds: Guilds;

    @Column({ default: false }) // welcome 설정
    welcome: boolean;

    @Column({ default: false }) // leave 설정
    leave: boolean;

    @Column({ default: false }) // moderation ban 설정
    moderationBan: boolean;

    @Column({ default: false }) // moderation kick 설정
    moderationKick: boolean;

    @Column({ default: false }) // moderation warn 설정
    moderationWarn: boolean;

    @Column({ default: false }) // 이코노미 설정
    economy: boolean;

    @Column() // logging 설정
    logging: boolean;
}
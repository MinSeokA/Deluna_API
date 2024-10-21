import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Guilds } from './guilds.entity';

@Entity('system')
export class System {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true }) // guildId는 유일해야 하므로 추가
    guildId: string;

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

    @ManyToOne(() => Guilds, (guilds) => guilds.system)
    guilds: Guilds;
}
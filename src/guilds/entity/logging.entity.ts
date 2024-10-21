import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Guilds } from './guilds.entity';

@Entity('System_Logs')
export class SystemLogs {
    @PrimaryGeneratedColumn()
    id: number;

    @Column() // 경고 로그
    warn: boolean;

    @Column() // 킥 로그
    kick: boolean;

    @Column() // 밴 로그
    ban: boolean;

    @Column() // 경제 로그
    economy: boolean;

    @ManyToOne(() => Guilds, (guilds) => guilds.systemLogs)
    guilds: Guilds;
}


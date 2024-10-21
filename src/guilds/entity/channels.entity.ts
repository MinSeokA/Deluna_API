import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { System } from './system.entity';
import { Guilds } from './guilds.entity';

@Entity('Log_channels')
export class LogChannels {
    // 채널 관련 개별 컬럼으로 변경
    @Column({ nullable: true }) // welcome 채널
    welcomeChannel: string | null;

    @Column({ nullable: true }) // leave 채널
    leaveChannel: string | null;

    @Column({ nullable: true }) // logs 채널
    logsChannel: string | null;

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Guilds, (guilds) => guilds.system)
    guilds: Guilds;
}
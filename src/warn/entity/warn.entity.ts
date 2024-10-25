import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('warn_users')
export class Warn {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    warnId: string;

    @Column()
    moderatorId: string; // 경고를 준 사용자의 ID

    @Column()
    userId: string; // 경고를 받은 사용자의 ID

    @Column()
    guildId: string;

    @Column({ type: 'text' })
    reason: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}
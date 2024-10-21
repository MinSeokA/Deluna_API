import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('banned_users')
export class BlockedUser {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    moderatorId: string; // 차단한 사용자의 ID

    @Column()
    userId: string; // 차단된 사용자의 ID

    @Column()
    guildId: string;

    @Column({ nullable: true })
    reason: string;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}

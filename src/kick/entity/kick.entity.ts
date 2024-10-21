import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('kicked_users') // 테이블 이름을 설정합니다.
export class KickedUser {
    @PrimaryGeneratedColumn()
    id: number; // 자동 증가하는 ID

    @Column()
    moderatorId: string; // 차단한 사용자의 ID

    @Column()
    userId: string; // 차단된 사용자의 ID

    @Column()
    guildId: string; // 서버 ID

    @Column({ type: 'text' })
    reason: string; // 차단 사유

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date; // 차단된 날짜 및 시간
}

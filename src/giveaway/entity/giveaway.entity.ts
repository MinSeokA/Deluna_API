// giveaway.schema.ts

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('giveaway')
export class Giveaway {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text', nullable: false })
    title: string; // 이벤트 제목

    @Column({ type: 'text', nullable: false })
    guildId: string; // 서버 ID

    @Column({ type: 'text', nullable: false })
    channelId: string; // 이벤트가 진행되는 채널 ID

    @Column({ type: 'text', nullable: false })
    messageId: string; // 이벤트 메시지 ID

    @Column({ type: 'text', nullable: false })
    prize: string; // 상품 설명

    @Column({ type: 'int', default: 1 })
    winnerCount: number; // 우승자 수

    @Column({ type: 'timestamp', nullable: false })
    endDate: Date; // 이벤트 종료 시간

    @Column({ type: 'simple-array', default: '' })
    participants: string[]; // 참가자들 (유저 ID 배열로 저장)

    @Column({ type: 'boolean', default: false })
    isEnded: boolean; // 종료 여부 확인

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

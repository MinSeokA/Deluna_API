import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('guilds')
export class Guilds {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true }) // guildId는 유일해야 하므로 추가
  guildId: string;

  @Column({ default: '!' }) // 기본 프리픽스 설정
  prefix: string;

  @Column()
  ownerId: string;

  // 개별 컬럼으로 변경
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

  @Column({ default: false }) // logging all 설정
  loggingAll: boolean;

  @Column({ default: false }) // logging warn 설정
  loggingWarn: boolean;

  @Column({ default: false }) // logging kick 설정
  loggingKick: boolean;

  @Column({ default: false }) // logging ban 설정
  loggingBan: boolean;

  // 채널 관련 개별 컬럼으로 변경
  @Column({ nullable: true }) // welcome 채널
  welcomeChannel: string | null;

  @Column({ nullable: true }) // leave 채널
  leaveChannel: string | null;

  @Column({ nullable: true }) // logs 채널
  logsChannel: string | null;
}

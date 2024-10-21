import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { System } from './system.entity';
import { SystemLogs } from './logging.entity';
import { LogChannels } from './channels.entity';

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

  // system.entity.ts와 연결
  @OneToMany(() => System, (system) => system.guilds)
  system: System;

  // logging.entity.ts와 연결
  @OneToMany(() => SystemLogs, (systemLogs) => systemLogs.guilds)
  systemLogs: SystemLogs;

  // channels.entity.ts와 연결
  @OneToMany(() => LogChannels, (logChannels) => logChannels.guilds)
  channels: LogChannels;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
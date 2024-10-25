import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { System } from './system.entity';
import { LogChannels } from './channels.entity';

@Entity('guilds')
export class Guilds {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  guildId: string;

  @Column({ default: '!' }) // 기본 프리픽스 설정
  prefix: string;

  @Column()
  ownerId: string;

  @OneToMany(() => System, (system) => system.guilds)
  systems: System[];

  @OneToMany(() => LogChannels, (channel) => channel.guilds)
  channels: LogChannels[];

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
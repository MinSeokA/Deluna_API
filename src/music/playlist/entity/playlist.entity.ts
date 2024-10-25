import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Song } from './song.entity'; // 경로를 맞게 수정하세요

@Entity('playlist')
export class Playlist {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: string;

    @Column()
    name: string; // 플레이리스트 이름

    @OneToMany(() => Song, (song) => song.playlist)
    songs: Song[];

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}

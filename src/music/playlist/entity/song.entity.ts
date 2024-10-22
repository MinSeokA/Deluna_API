import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Playlist } from './playlist.entity'; // 경로를 맞게 수정하세요

@Entity('songs')
export class Song {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar' }) // songId를 문자열로 정의
    songId: string;

    @Column()
    title: string;

    @Column()
    duration: string;
  
    @Column()
    url: string;

    @ManyToOne(() => Playlist, (playlist) => playlist.songs, { onDelete: 'CASCADE' })
    playlist: Playlist;
}

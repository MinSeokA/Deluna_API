import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Playlist } from './entity/playlist.entity';
import { Song } from './entity/song.entity';
import { Repository } from 'typeorm';
import { Result, success, fail } from 'src/utils/result';


@Injectable()
export class PlaylistService {
  constructor(
    @InjectRepository(Playlist)
    private playlistRepository: Repository<Playlist>,
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
  ) {}

  async createPlaylist(userId: string, name: string): Promise<Result<Playlist>> {
    // 플레이리스트 이름 중복 확인
    const existingPlaylist = await this.playlistRepository.findOne({ where: { userId, name } });
    if (existingPlaylist) {
      return fail('이미 존재하는 플레이리스트 이름입니다.');
    }

    const playlist = this.playlistRepository.create({ userId, name });
    return success('플레이리스트를 성공적으로 생성했습니다.', await this.playlistRepository.save(playlist));
}

  async getPlaylists(userId: string): Promise<Result<Playlist[]>> {
    
    const playlist = await this.playlistRepository.find({
      where: { userId: userId }, // 조건에 맞게 사용자의 플레이리스트 조회
      relations: ['songs'], // 'songs' 필드를 포함하여 로드
    });

    if (!playlist || playlist.length === 0) {
      return fail('플레이리스트를 찾을 수 없습니다.');
    }
    return success('플레이리스트 목록을 성공적으로 가져왔습니다.', playlist); 
  }

  async addSongToPlaylist(playlistName: string, song: Song): Promise<Result<Playlist>> {
    const playlist = await this.playlistRepository.findOne({
      where: { name: playlistName },
      relations: ['songs'],
    });
    if (!playlist) {
      return fail('해당 이름의 플레이리스트를 찾을 수 없습니다.');
    }
  
    // 기존에 동일한 노래가 있는지 확인
    const existingSong = playlist.songs.find(s => s.songId === song.songId);
    if (existingSong) {
      return fail('이미 추가된 노래입니다.');
    }
  
    // 먼저 song 엔티티를 저장 (필요시)
    const newSong = await this.songRepository.save(song); // Song 엔티티를 songRepository에서 저장
  
    // 저장된 song을 playlist에 추가
    playlist.songs.push(newSong);
  
    // Playlist 엔티티 업데이트
    const updatedPlaylist = await this.playlistRepository.save(playlist);
  
    return success(playlistName + '에 노래가 추가되었습니다.', updatedPlaylist);
  }
  
  async deleteSongFromPlaylist(playlistName: string, songId: string): Promise<Result<Playlist>> {
    const playlist = await this.playlistRepository.findOne({
      where: { name: playlistName },
      relations: ['songs'],
    });
    if (!playlist) {
      return fail('해당 이름의 플레이리스트를 찾을 수 없습니다.');
    }
    playlist.songs = playlist.songs.filter(song => song.songId !== songId);
    return success(playlistName + '에서 노래가 삭제되었습니다.', await this.playlistRepository.save(playlist));
  }

  // 해당 플레이리스트 이름으로 조회
  async getPlaylistByName(playlistName: string): Promise<Result<Playlist>> {
    const playlist = await this.playlistRepository.findOne({
      where: { name: playlistName },
      relations: ['songs'],
    });
    if (!playlist) {
      return fail('해당 이름의 플레이리스트를 찾을 수 없습니다.');
    }

    return success('플레이리스트를 성공적으로 가져왔습니다.', playlist);
  }
}

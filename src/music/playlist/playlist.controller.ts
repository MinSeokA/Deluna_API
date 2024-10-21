import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { Song } from './entity/song.entity';

@Controller('playlist')
export class PlaylistController {
  constructor(
    private readonly playlistService: PlaylistService,
  ) {}

  // 플레이리스트 추가
  @Post('create')
  async addPlaylist(
    @Body() body: { userId: string, name: string }
  ): Promise<any> {
    return this.playlistService.createPlaylist(body.userId, body.name);
  }

  // 플레이리스트 목록 가져오기
  @Get('/:userId')
  async getPlaylists(
    @Param('userId') userId: string
  ): Promise<any> {
    return this.playlistService.getPlaylists(userId);
  }

  // 플레이리스트에 노래 추가
  @Post('addSong')
  async addSongToPlaylist(
    @Body() body: { playlistName: string, song: Song }
  ): Promise<any> {
    return this.playlistService.addSongToPlaylist(body.playlistName, body.song);
  }

  // 플레이리스트에서 노래 삭제
  @Post('deleteSong')
  async deleteSongFromPlaylist(
    @Body() body: { playlistName: string, songId: string }
  ): Promise<any> {
    return this.playlistService.deleteSongFromPlaylist(body.playlistName, body.songId);
  }

  // 플레이리스트 이름으로 조회
  @Get('get/:playlistName')
  async getPlaylistByName(
    @Param('playlistName') playlistName: string
  ): Promise<any> {
    return this.playlistService.getPlaylistByName(playlistName);
  }

}

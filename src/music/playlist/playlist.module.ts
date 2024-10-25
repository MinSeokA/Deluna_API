import { Module } from '@nestjs/common';
import { PlaylistController } from './playlist.controller';
import { PlaylistService } from './playlist.service';
import { Playlist } from './entity/playlist.entity';
import { Song } from './entity/song.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Playlist, Song])],
  controllers: [PlaylistController],
  providers: [PlaylistService]
})
export class PlaylistModule {}

import { Module } from '@nestjs/common';
import { KickService } from './kick.service';
import { KickController } from './kick.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KickedUser } from './entity/kick.entity';
import { Guilds } from 'src/guilds/entity/guilds.entity';

@Module({
  imports: [TypeOrmModule.forFeature([KickedUser, Guilds])],
  providers: [KickService],
  controllers: [KickController]
})
export class KickModule {}

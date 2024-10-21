import { Module } from '@nestjs/common';
import { GuildsController } from './guilds.controller';
import { GuildsService } from './guilds.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guilds } from './entity/guilds.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Guilds])],
  controllers: [GuildsController],
  providers: [GuildsService]
})
export class GuildsModule {}

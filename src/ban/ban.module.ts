import { Module } from '@nestjs/common';
import { BanController } from './ban.controller';
import { BanService } from './ban.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockedUser } from './entity/ban-user.entity';
import { Guilds } from 'src/guilds/entity/guilds.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BlockedUser, Guilds])],
  controllers: [BanController],
  providers: [BanService]
})
export class BanModule {}

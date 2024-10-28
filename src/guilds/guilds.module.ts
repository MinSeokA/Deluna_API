import { Module } from '@nestjs/common';
import { GuildsController } from './guilds.controller';
import { GuildsService } from './guilds.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guilds } from './entity/guilds.entity';
import { System } from './entity/system.entity';
import { LogChannels } from './entity/channels.entity';
import { Economy } from 'src/economy/entity/economy.entity';
import { EconomyGuild } from 'src/economy/entity/economy-guild.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Guilds, System, LogChannels, Economy, EconomyGuild])],
  controllers: [GuildsController],
  providers: [GuildsService]
})
export class GuildsModule {}

import { Module } from '@nestjs/common';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Economy } from '../entity/economy.entity';
import { Guilds } from 'src/guilds/entity/guilds.entity';
import { Shop } from '../entity/shop.entity';
import { EconomyGuild } from '../entity/economy-guild.entity';
import { Item } from '../entity/item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Economy, Guilds, Shop, EconomyGuild, Item])
  ],
  controllers: [ShopController],
  providers: [ShopService]
})
export class ShopModule {}

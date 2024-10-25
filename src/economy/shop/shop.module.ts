import { Module } from '@nestjs/common';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Economy } from '../entity/economy.entity';
import { Guilds } from 'src/guilds/entity/guilds.entity';
import { Shop } from '../entity/shop.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Economy, Guilds, Shop])
  ],
  controllers: [ShopController],
  providers: [ShopService]
})
export class ShopModule {}

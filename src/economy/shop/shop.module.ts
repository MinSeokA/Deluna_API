import { Module } from '@nestjs/common';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Economy } from '../balance/entity/economy.entity';
import { Guilds } from 'src/guilds/entity/guilds.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Economy, Guilds])
  ],
  controllers: [ShopController],
  providers: [ShopService]
})
export class ShopModule {}

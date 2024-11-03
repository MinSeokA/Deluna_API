// giveaway.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Giveaway } from './entity/giveaway.entity';
import { GiveawayService } from './giveaway.service';
import { GiveawayController } from './giveaway.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Giveaway])],
    providers: [GiveawayService],
    controllers: [GiveawayController],
    exports: [GiveawayService], // 필요시 다른 모듈에서 사용 가능하도록 exports 추가
})
export class GiveawayModule {}

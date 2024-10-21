import { Module } from '@nestjs/common';
import { EconomyController } from './economy.controller';
import { EconomyService } from './economy.service';

@Module({
  controllers: [EconomyController],
  providers: [EconomyService]
})
export class EconomyModule {}

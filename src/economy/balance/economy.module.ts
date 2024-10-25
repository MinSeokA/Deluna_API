import { Module } from '@nestjs/common';
import { EconomyController } from './economy.controller';
import { EconomyService } from './economy.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Economy } from '../entity/economy.entity';
import { Guilds } from 'src/guilds/entity/guilds.entity';
import { JobsModule } from '../jobs/jobs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Economy, Guilds]),
    JobsModule
  ],
  controllers: [EconomyController],
  providers: [EconomyService]
})
export class EconomyModule {}

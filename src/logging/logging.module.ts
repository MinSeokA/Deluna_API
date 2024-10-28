import { Module } from '@nestjs/common';
import { LoggingService } from './logging.service';
import { LoggingController } from './logging.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Logging } from './entity/logging.entity';
import { Guilds } from 'src/guilds/entity/guilds.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Logging, Guilds]),
  ],
  providers: [LoggingService],
  controllers: [LoggingController]
})
export class LoggingModule {}

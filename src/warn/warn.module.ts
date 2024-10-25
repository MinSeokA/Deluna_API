import { Module } from '@nestjs/common';
import { WarnController } from './warn.controller';
import { WarnService } from './warn.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Warn } from './entity/warn.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Warn])
  ],
  controllers: [WarnController],
  providers: [WarnService]
})
export class WarnModule {}

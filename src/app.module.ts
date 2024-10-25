import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StatusModule } from './status/status.module';
import { BanModule } from './ban/ban.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuildsModule } from './guilds/guilds.module';
import { KickModule } from './kick/kick.module';
import { WarnModule } from './warn/warn.module';
import { PlaylistModule } from './music/playlist/playlist.module';
import { EconomyModule } from './economy/balance/economy.module';
import { ShopModule } from './economy/shop/shop.module';
import { LoggingModule } from './logging/logging.module';

@Module({
  imports: [
    StatusModule,
    BanModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '61.78.89.183', // 데이터베이스 호스트
      port: 5432, // 데이터베이스 포트
      username: 'postgres', // 데이터베이스 사용자 이름
      password: 'root', // 데이터베이스 비밀번호
      database: 'deluna', // 데이터베이스 이름
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // 개발 중에는 true로 설정 (생산에서는 false로 설정)
  }),
  GuildsModule,
  KickModule,
  WarnModule,
  PlaylistModule,
  EconomyModule,
  ShopModule,
  LoggingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

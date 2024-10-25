import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logging } from './entity/logging.entity';
import { Repository } from 'typeorm';
import { Result, success } from 'src/utils/result';

@Injectable()
export class LoggingService {
    constructor(
        @InjectRepository(Logging)
        private readonly loggingRepository: Repository<Logging>
    ) {}

    // 길드 로그 생성
    async addGuildLog(guildId: string): Promise<Result<any>> {
        const guild = this.loggingRepository.create({
            guildId
        });

        const logging = await this.loggingRepository.save(guild);

        return success("길드 로그 생성을 성공하였습니다.", logging);
    }
}

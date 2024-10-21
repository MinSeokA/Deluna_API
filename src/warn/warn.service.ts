import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Warn } from './entity/warn.entity';
import { Repository } from 'typeorm';
import WarnDto from './dto/warn.dto';
import { Result, success, fail } from 'src/utils/result';

@Injectable()
export class WarnService {
  constructor(
    @InjectRepository(Warn)
    private readonly warnRepository: Repository<Warn>,
    
  ) {}
  private generateRandomId(length: number): string {
    return Math.random().toString(36).substring(2, 2 + length); // 2번째 인덱스부터 길이만큼 잘라냅니다.
  }

  // 경고 추가
  async addWarn(warn: WarnDto): Promise<Result<Warn>> {
    const newWarn = this.warnRepository.create({
      ...warn,
      warnId: this.generateRandomId(7), // 랜덤 문자열 생성
    });

    await this.warnRepository.save(newWarn); // 새로운 경고를 저장
    return success('사용자에게 경고를 성공적으로 부여했습니다.', newWarn); // 성공 메시지 반환
  }

  // 전체 경고 목록 가져오기
  async getWarns(): Promise<Result<Warn[]>> {
    const warns = await this.warnRepository.find(); // 경고 목록 가져오기

    return success('경고 목록을 가져왔습니다.', warns); // 성공 메시지 반환 
  }

  // 특정 길드에서 발생한 경고 목록 가져오기
  async getWarnsByGuild(guildId: string): Promise<Result<Warn[]>> {
    const warns = await this.warnRepository.find({ where: { guildId } }); // 특정 길드에서 발생한 경고 목록 가져오기
    
    return success('경고 목록을 가져왔습니다.', warns); // 성공 메시지 반환
  }

  // 특정 유저의 경고 기록 가져오기
  async getWarnUser(userId: string, guildId: string): Promise<Result<Warn[]>> {
    const warns = await this.warnRepository.find({ where: { userId, guildId } }); // 특정 유저의 경고 목록 가져오기
    return success('경고 목록을 가져왔습니다.', warns); // 특정 유저의 경고 목록 가져오기
  }

  // 경고 삭제
  async deleteWarn(userId: string, warnId: string): Promise<Result<Warn>> {
    const warn = await this.warnRepository.findOne({ where: { warnId: warnId, userId: userId } }); // 경고 ID로 경고를 찾음

    if (!warn) {
      return fail('해당 ID의 경고를 찾을 수 없습니다.'); // 경고가 없으면 실패 메시지 반환
    }

    await this.warnRepository.remove(warn); // 경고 삭제
    return success('해당 사용자의 경고를 성공적으로 삭제했습니다.', warn); // 성공 메시지 반환
  }
}

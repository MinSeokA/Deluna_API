import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Economy } from '../entity/economy.entity';
import { Repository } from 'typeorm';
import { Guilds } from 'src/guilds/entity/guilds.entity';
import { Result, success, fail } from 'src/utils/result';
import { EconomyGuild } from '../entity/economy-guild.entity';

@Injectable()
export class EconomyService {
  constructor(
    @InjectRepository(Economy)
    private readonly economyRepository: Repository<Economy>,

    @InjectRepository(Guilds)
    private readonly guildsRepository: Repository<Guilds>,

    @InjectRepository(EconomyGuild)
    private readonly economyGuildRepository: Repository<EconomyGuild>,
  ) {}

  private async isEconomyEnabled(guildId: string): Promise<boolean> {
    const guild = await this.guildsRepository.findOne({
      where: { guildId },
      relations: ['systems'],
    });

    return guild?.systems[0].economy === true;
  }

  async getBalance(userId: string, guildId: string): Promise<Result<Economy>> {
    // 이코노미 시스템이 활성화되어 있는지 확인
    if (!(await this.isEconomyEnabled(guildId))) {
      return fail('길드에서 이코노미 시스템을 사용하지 않습니다.');
    }

    // 유저가 존재하는지 확인
    const exuser = await this.economyRepository.findOne({
      where: { userId },
    });

    // 유저가 존재하지 않으면 유저 생성
    if (!exuser) {
      const user = this.economyRepository.create({
        userId,
        balance: 0,
        bank: 5000,
      }); // 적절한 초기 값을 설정
      await this.economyRepository.save(user);

      return success('성공적으로 잔액을 생성했습니다.', user);
    }

    return success('성공적으로 잔액을 가져왔습니다.', exuser);
  }

  // 이체 기능
  async transferBalance(
    senderId: string,
    receiverId: string,
    guildId: string,
    amount: number,
  ): Promise<Result<void>> {
    if (!(await this.isEconomyEnabled(guildId))) {
      return fail('길드에서 이코노미 시스템을 사용하지 않습니다.');
    }

    const sender = await this.economyRepository.findOne({
      where: { userId: senderId },
    });
    const receiver = await this.economyRepository.findOne({
      where: { userId: receiverId },
    });

    if (!sender || !receiver) {
      return fail('잔액을 이체할 사용자를 찾을 수 없습니다.');
    }

    if (sender.balance < amount) {
      return fail('잔액이 부족합니다.');
    }

    await this.economyRepository.save([
      { ...sender, balance: sender.balance - amount },
      { ...receiver, balance: receiver.balance + amount },
    ]);

    return success('성공적으로 잔액을 이체했습니다.');
  }
  // 출금 기능 bank to balance
  async withdrawBalance(
    userId: string,
    guildId: string,
    amount: number,
  ): Promise<Result<void>> {
    if (!(await this.isEconomyEnabled(guildId))) {
      return fail('길드에서 이코노미 시스템을 사용하지 않습니다.');
    }

    const economy = await this.economyRepository.findOne({
      where: { userId },
    });

    if (!economy) {
      return fail('잔액을 찾을 수 없습니다.');
    }

    if (economy.balance < amount) {
      return fail('잔액이 부족합니다.');
    }

    await this.economyRepository.save({
      ...economy,
      balance: economy.balance - amount,
    });

    return success('성공적으로 출금했습니다.');
  }

  // 입금 기능 balance to bank
  async depositBalance(
    userId: string,
    guildId: string,
    amount: number,
  ): Promise<Result<void>> {
    if (!(await this.isEconomyEnabled(guildId))) {
      return fail('길드에서 이코노미 시스템을 사용하지 않습니다.');
    }

    const economy = await this.economyRepository.findOne({
      where: { userId },
    });

    if (!economy) {
      return fail('잔액을 찾을 수 없습니다.');
    }

    if (economy.balance < amount) {
      return fail('잔액이 부족합니다.');
    }

    await this.economyRepository.save({
      ...economy,
      balance: economy.balance -= amount,
      bank: economy.bank += amount,
    });

    return success('성공적으로 입금했습니다.');
  }

  async getTopBalances(
    guildId: string,
    limit: number,
  ): Promise<Result<Economy[]>> {
    if (!(await this.isEconomyEnabled(guildId))) {
      return fail('길드에서 이코노미 시스템을 사용하지 않습니다.');
    }

    const topBalances = await this.economyRepository.find({
      order: { balance: 'DESC' },
      take: limit,
    });

    return success('성공적으로 상위 잔액을 가져왔습니다.', topBalances);
  }

  async setBalance(
    userId: string,
    guildId: string,
    balance: number,
  ): Promise<Result<void>> {
    if (!(await this.isEconomyEnabled(guildId))) {
      return fail('길드에서 이코노미 시스템을 사용하지 않습니다.');
    }

    await this.economyRepository.save({ userId, guildId, balance });
    return success('성공적으로 잔액을 설정했습니다.');
  }

  async setBank(
    userId: string,
    guildId: string,
    bank: number,
  ): Promise<Result<void>> {
    if (!(await this.isEconomyEnabled(guildId))) {
      return fail('길드에서 이코노미 시스템을 사용하지 않습니다.');
    }

    await this.economyRepository.save({ userId, guildId, bank });
    return success('성공적으로 은행 잔액을 설정했습니다.');
  }

  async resetAllEconomies(): Promise<Result<void>> {
    await this.economyRepository.delete({});
    return success('성공적으로 모든 이코노미를 초기화했습니다.');
  }

  async resetUserBank(userId: string, guildId: string): Promise<Result<void>> {
    await this.economyRepository.save({ userId, guildId, bank: 0 });
    return success('성공적으로 사용자 은행 잔액을 초기화했습니다.');
  }

  async resetUserBalance(
    userId: string,
    guildId: string,
  ): Promise<Result<void>> {
    await this.economyRepository.save({ userId, guildId, balance: 0 });
    return success('성공적으로 사용자 잔액을 초기화했습니다.');
  }

// 24시간 후에 가능하도록 설정
async checkIn(userId: string, guildId: string): Promise<Result<Economy>> {
    if (!(await this.isEconomyEnabled(guildId))) {
        return fail('길드에서 이코노미 시스템을 사용하지 않습니다.');
    }

    const economy = await this.economyRepository.findOne({
        where: { userId },
    });
    const guild = await this.economyGuildRepository.findOne({
        where: { guildId },
    });

    if (!economy) {
        return fail('자액을 찾을 수 없습니다.');
    }
    
    if (!guild.checkInReward || guild.checkInReward === 0) {
        return fail('출석체크 보상이 설정되지 않았습니다.');
    }

    if (!economy.DailyCheckInTime) {
        // 첫 출석 체크의 경우
        economy.DailyCheckInTime = new Date(); // 현재 시간으로 설정
    } else {
        // 마지막 출석 체크 시간과 현재 시간 비교
        const lastCheckInTime = economy.DailyCheckInTime.getTime();
        const currentTime = Date.now();
        
        // 24시간(86400000 milliseconds) 이내인지 확인
        if (currentTime < lastCheckInTime + 86400000) {
            // 남은 시간 계산
            const remainingTime = Math.ceil((lastCheckInTime + 86400000 - currentTime) / 1000); // 초 단위로 변환
            return fail(`다음 출석체크는 ${formatTime(remainingTime)} 후에 가능합니다.`);
        }
    }

    // 출석 체크 진행
    economy.bank += guild.checkInReward; // 출석체크 보상
    economy.DailyCheckInTime = new Date(); // 현재 시간으로 업데이트

    await this.economyRepository.save(economy);

    return success('성공적으로 출석체크를 했습니다.', { ...economy, checkInReward: guild.checkInReward });
}

  // 출석체크 보상 설정
    async setCheckInReward(
        guildId: string,
        reward: number,
    ): Promise<Result<void>> {
        const guild = await this.economyGuildRepository.findOne({
        where: { guildId },
        });
    
        if (!guild) {
        return fail('길드를 찾을 수 없습니다.');
        }
    
        guild.checkInReward = reward;
        await this.economyGuildRepository.save(guild);
    
        return success('성공적으로 출석체크 보상을 설정했습니다.');
    }
}

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
  
    return `${hours}시간 ${minutes}분 ${remainingSeconds}초 후`;
}
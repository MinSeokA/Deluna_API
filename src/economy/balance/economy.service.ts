import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Economy } from '../entity/economy.entity';
import { Repository } from 'typeorm';
import { Guilds } from 'src/guilds/entity/guilds.entity';
import { Result, success, fail } from 'src/utils/result';
import { JobsDto } from '../dto/jobs.dto';
import { InventoryDto } from '../dto/inventory.dto';

@Injectable()
export class EconomyService {
    constructor(
        @InjectRepository(Economy)
        private readonly economyRepository: Repository<Economy>,

        @InjectRepository(Guilds)
        private readonly guildsRepository: Repository<Guilds>,
    ) {}

    private async isEconomyEnabled(guildId: string): Promise<boolean> {
        const guild = await this.guildsRepository.findOne({ where: { guildId }, relations: ['systems'] });

        return guild?.systems[0].economy === true;
    }

    async getBalance(userId: string, guildId: string): Promise<Result<Economy>> {
        // 이코노미 시스템이 활성화되어 있는지 확인
        if (!await this.isEconomyEnabled(guildId)) {
            return fail('길드에서 이코노미 시스템을 사용하지 않습니다.');
        }
    
        // 유저가 존재하는지 확인
        const exuser = await this.economyRepository.findOne({ where: { userId, guildId } });
    
        // 유저가 존재하지 않으면 유저 생성
        if (!exuser) {
            const user = this.economyRepository.create({ userId, guildId, balance: 0, bank: 5000}); // 적절한 초기 값을 설정
            await this.economyRepository.save(user);
    
            return success('성공적으로 잔액을 생성했습니다.', user);
        }
    
        return success('성공적으로 잔액을 가져왔습니다.', exuser);
    }

    // 이체 기능
    async transferBalance(senderId: string, receiverId: string, guildId: string, amount: number): Promise<Result<void>> {
        if (!await this.isEconomyEnabled(guildId)) {
            return fail('길드에서 이코노미 시스템을 사용하지 않습니다.');
        }

        const sender = await this.economyRepository.findOne({ where: { userId: senderId, guildId } });
        const receiver = await this.economyRepository.findOne({ where: { userId: receiverId, guildId } });

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
    async withdrawBalance(userId: string, guildId: string, amount: number): Promise<Result<void>> {
        if (!await this.isEconomyEnabled(guildId)) {
            return fail('길드에서 이코노미 시스템을 사용하지 않습니다.');
        }

        const economy = await this.economyRepository.findOne({ where: { userId, guildId } });

        if (!economy) {
            return fail('잔액을 찾을 수 없습니다.');
        }

        if (economy.balance < amount) {
            return fail('잔액이 부족합니다.');
        }

        await this.economyRepository.save({ ...economy, balance: economy.balance - amount });

        return success('성공적으로 출금했습니다.');
    }

    // 입금 기능 balance to bank 
    async depositBalance(userId: string, guildId: string, amount: number): Promise<Result<void>> {
        if (!await this.isEconomyEnabled(guildId)) {
            return fail('길드에서 이코노미 시스템을 사용하지 않습니다.');
        }

        const economy = await this.economyRepository.findOne({ where: { userId, guildId } });

        if (!economy) {
            return fail('잔액을 찾을 수 없습니다.');
        }

        if (economy.balance < amount) {
            return fail('잔액이 부족합니다.');
        }

        await this.economyRepository.save({ ...economy, balance: economy.balance + amount });

        return success('성공적으로 입금했습니다.');
    }

    async getTopBalances(guildId: string, limit: number): Promise<Result<Economy[]>> {
        if (!await this.isEconomyEnabled(guildId)) {
            return fail('길드에서 이코노미 시스템을 사용하지 않습니다.');
        }

        const topBalances = await this.economyRepository.find({
            where: { guildId },
            order: { balance: 'DESC' },
            take: limit,
        });

        return success('성공적으로 상위 잔액을 가져왔습니다.', topBalances);
    }

    async getBalances(guildId: string): Promise<Result<Economy[]>> {
        if (!await this.isEconomyEnabled(guildId)) {
            return fail('길드에서 이코노미 시스템을 사용하지 않습니다.');
        }

        const balances = await this.economyRepository.find({ where: { guildId } });
        return success('성공적으로 잔액 목록을 가져왔습니다.', balances);
    }

    async setBalance(userId: string, guildId: string, balance: number): Promise<Result<void>> {
        if (!await this.isEconomyEnabled(guildId)) {
            return fail('길드에서 이코노미 시스템을 사용하지 않습니다.');
        }

        await this.economyRepository.save({ userId, guildId, balance });
        return success('성공적으로 잔액을 설정했습니다.');
    }

    async setBank(userId: string, guildId: string, bank: number): Promise<Result<void>> {
        if (!await this.isEconomyEnabled(guildId)) {
            return fail('길드에서 이코노미 시스템을 사용하지 않습니다.');
        }

        await this.economyRepository.save({ userId, guildId, bank });
        return success('성공적으로 은행 잔액을 설정했습니다.');
    }

    async resetEconomy(guildId: string): Promise<Result<void>> {
        if (!await this.isEconomyEnabled(guildId)) {
            return fail('길드에서 이코노미 시스템을 사용하지 않습니다.');
        }

        await this.economyRepository.delete({ guildId });
        return success('성공적으로 이코노미를 초기화했습니다.');
    }

    async resetAllEconomies(): Promise<Result<void>> {
        await this.economyRepository.delete({});
        return success('성공적으로 모든 이코노미를 초기화했습니다.');
    }


    async resetUserBank(userId: string, guildId: string): Promise<Result<void>> {
        await this.economyRepository.save({ userId, guildId, bank: 0 });
        return success('성공적으로 사용자 은행 잔액을 초기화했습니다.');
    }

    async resetUserBalance(userId: string, guildId: string): Promise<Result<void>> {
        await this.economyRepository.save({ userId, guildId, balance: 0 });
        return success('성공적으로 사용자 잔액을 초기화했습니다.');
    }


}

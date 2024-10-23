import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Economy } from '../entity/economy.entity';
import { Repository } from 'typeorm';
import { Guilds } from 'src/guilds/entity/guilds.entity';
import { Result, success } from 'src/utils/result';
import { InventoryDto } from '../dto/inventory.dto';
import { JobsDto } from '../dto/jobs.dto';

@Injectable()
export class ShopService {
    private async getItem(itemId: string, guildId: string) {
        const item = await this.economyRepository.findOne({ where: { guildId, shop: { itemId } }, relations: ['shop'] });
        return item.shop[0]
    }

    private async getGuild(guildId: string) {
        const guild = await this.guildsRepository.findOne({ where: { guildId }, relations: ["systems"] })

        return guild;
    }
    private async getUser(userId: string, guildId: string): Promise<Economy> {
        const user = this.economyRepository.findOne({ where: { userId, guildId } });

        // 유저가 존재하지 않으면 유저 생성
        if (!user) {
            const user = this.economyRepository.create({
                userId,
                guildId,
                balance: 5000,
                inventory: InventoryDto[0],
                job: JobsDto[0],
            });
            await this.economyRepository.save(user);
        }

        return user
    }

    constructor(
        @InjectRepository(Economy)
        private readonly economyRepository: Repository<Economy>,
        @InjectRepository(Guilds)
        private readonly guildsRepository: Repository<Guilds>,

    ) {
    }

    private async isEconomyEnabled(guildId: string): Promise<boolean> {
        const guild = (await this.getGuild(guildId)).systems[0];
        return guild.economy === true;
      }

    // 상점에서 아이템 구매
    async buyItem(userId: string, guildId: string, itemId: string): Promise<Result<Economy>> {
        if (!await this.isEconomyEnabled(guildId)) {
            return;
        }

        // 아이템 id로 아이템 정보 가져오기
        const item = await this.getItem(itemId, guildId);
        const user = await this.getUser(userId, guildId);
        // 아이템이 존재하지 않으면 `아이템을 찾을 수 없습니다.` 반환
        
        if (!item) {
            return fail(`아이템을 찾을 수 없습니다.`);
        }

        // 잔액이 부족하면 `잔액이 부족합니다.` 반환
        if (user.balance < item.price) {
            return fail(`잔액이 부족합니다.`);
        }

        // 잔액 차감
        user.balance -= item.price;

        // 아이템 추가
        user.inventory[0].item.push(item.name);

        // 잔액과 인벤토리 업데이트
        const buyResult = await this.economyRepository.save(user);

        return success(`성공적으로 ${item.name}을 구매했습니다.`, buyResult);

    }

    // 상점에서 아이템 판매
    async sellItem(userId: string, guildId: string, itemId: string): Promise<Result<Economy>> {
        if (!await this.isEconomyEnabled(guildId)) {
            return;
        }

        // 아이템 id로 아이템 정보 가져오기
        const item = await this.getItem(itemId, guildId);
        const user = await this.getUser(userId, guildId);

        // 아이템이 존재하지 않으면 `아이템을 찾을 수 없습니다.` 반환
        if (!item) {
            return fail(`아이템을 찾을 수 없습니다.`);
        }

        // 인벤토리에 아이템이 없으면 `아이템을 찾을 수 없습니다.` 반환
        if (!user.inventory[0].item.includes(item.name)) {
            return fail(`아이템을 찾을 수 없습니다.`);
        }

        // 잔액 추가
        user.balance += item.price;

        // 아이템 삭제
        user.inventory[0].item = user.inventory[0].item.filter((inventoryItem) => inventoryItem !== item.name);

        // 잔액과 인벤토리 업데이트
        const sellResult = await this.economyRepository.save(user);

        return success(`성공적으로 ${item.name}을 판매했습니다.`, sellResult);
    }

    // 상점에서 아이템 목록 가져오기
    async getShopItems(guildId: string): Promise<Result<Economy[]>> {
        if (!await this.isEconomyEnabled(guildId)) {
            return;
        }

        const items = await this.economyRepository.find({ where: { guildId } });

        return success('성공적으로 상점 아이템 목록을 가져왔습니다.', items);
    }

    // 상점에서 아이템 추가
    async addShopItem(guildId: string, item: Economy): Promise<Result<Economy>> {
        if (!await this.isEconomyEnabled(guildId)) {
            return;
        }

        const newItem = this.economyRepository.create(item);

        const addItem = await this.economyRepository.save(newItem);

        return success('성공적으로 상점 아이템을 추가했습니다.', addItem);
    }

    // 상점에서 아이템 삭제
    async deleteShopItem(guildId: string, itemId: string): Promise<Result<void>> {
        if (!await this.isEconomyEnabled(guildId)) {
            return;
        }

        const item = await this.getItem(itemId, guildId);

        if (!item) {
            return fail('아이템을 찾을 수 없습니다.');
        }

        await this.economyRepository.delete(item);

        return success('성공적으로 상점 아이템을 삭제했습니다.');
    }

    // 상점에서 아이템 수정
    async updateShopItem(guildId: string, itemId: string, item: Economy): Promise<Result<Economy>> {
        if (!await this.isEconomyEnabled(guildId)) {
            return;
        }

        const existingItem = await this.getItem(itemId, guildId);

        if (!existingItem) {
            return fail('아이템을 찾을 수 없습니다.');
        }

        const updatedItem = await this.economyRepository.save({ ...existingItem, ...item });

        return success('성공적으로 상점 아이템을 수정했습니다.', updatedItem);
    }

    // 상점에서 아이템 구매 기록 가져오기

}

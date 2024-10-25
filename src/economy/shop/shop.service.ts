import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Economy } from '../entity/economy.entity';
import { Repository } from 'typeorm';
import { Guilds } from 'src/guilds/entity/guilds.entity';
import { Result, success } from 'src/utils/result';
import { InventoryDto } from '../dto/inventory.dto';
import { JobsDto } from '../dto/jobs.dto';
import { Item } from '../entity/item.entity';
import { Shop } from '../entity/shop.entity';

@Injectable()
export class ShopService {
    private async getItem(itemId: string, guildId: string) {
        const item = await this.economyRepository.findOne({ where: { guildId, shop: { items: { itemId } } }, relations: ['shop', 'items'] });
        return item.shop.items.find((item) => item.itemId === itemId);
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
        @InjectRepository(Shop)
        private readonly shopRepository: Repository<Shop>

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

    async addShopItem(guildId: string, itemData: Item): Promise<Result<Economy>> {
        if (!await this.isEconomyEnabled(guildId)) {
            return;
        }
    
        const economy = await this.economyRepository.findOne({ where: { guildId }, relations: ['shop'] });
    
        if (!economy) {
            const newShop = this.shopRepository.create({ items: [itemData] });
            const newEconomy = this.economyRepository.create({ 
                guildId, 
                shop: newShop 
            });
            const savedEconomy = await this.economyRepository.save(newEconomy);
            return success('성공적으로 아이템을 상점에 추가했습니다.', savedEconomy);
        } else {
            economy.shop = economy.shop || this.shopRepository.create();
            economy.shop.items.push(itemData);
            await this.shopRepository.save(economy.shop); // 상점 업데이트
            const updatedEconomy = await this.economyRepository.save(economy);
            return success('성공적으로 아이템을 상점에 추가했습니다.', updatedEconomy);
        }
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

        await this.economyRepository.delete({
            guildId: guildId,
            shop: { items: { itemId: itemId } }
        })

        return success('성공적으로 상점 아이템을 삭제했습니다.');
    }

    // 상점에서 아이템 수정
    async updateShopItem(guildId: string, itemId: string, updatedData: Partial<Item>): Promise<Result<Economy>> {
        if (!await this.isEconomyEnabled(guildId)) {
            return;
        }
    
        const existingItem = await this.getItem(itemId, guildId);
    
        if (!existingItem) {
            return fail('아이템을 찾을 수 없습니다.');
        }
    
        // 수정할 데이터를 기존 아이템에 적용
        Object.assign(existingItem, updatedData);
    
        // 수정된 아이템 저장
        await this.economyRepository.save(existingItem);
    
        // 해당 guildId의 Economy 정보를 다시 가져옵니다.
        const updatedEconomy = await this.economyRepository.findOne({ where: { guildId }, relations: ['shop'] });
    
        return success('성공적으로 상점 아이템을 수정했습니다.', updatedEconomy);
    }    
}

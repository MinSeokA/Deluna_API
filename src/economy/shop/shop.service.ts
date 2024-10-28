import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Economy } from '../entity/economy.entity';
import { In, Repository } from 'typeorm';
import { Guilds } from 'src/guilds/entity/guilds.entity';
import { Result, success, fail } from 'src/utils/result';
import { Item } from '../entity/item.entity';
import { Shop } from '../entity/shop.entity';
import { EconomyGuild } from '../entity/economy-guild.entity';
import { InventoryDto } from '../dto/inventory.dto';

@Injectable()
export class ShopService {
  private async getItem(identifier: string, guildId: string) {
    const item = await this.economyGuildRepository
      .createQueryBuilder('economyGuild')
      .leftJoinAndSelect('economyGuild.shop', 'shop')
      .leftJoinAndSelect('shop.items', 'items')
      .where('economyGuild.guildId = :guildId', { guildId })
      .andWhere('(items.itemId = :identifier OR items.name = :identifier)', {
        identifier,
      })
      .getOne();

    return item?.shop?.items.find(
      (item) => item.itemId === identifier || item.name === identifier,
    );
  }
  private async getGuild(guildId: string) {
    const guild = await this.guildsRepository.findOne({
      where: { guildId },
      relations: ['systems'],
    });

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
      });
      await this.economyRepository.save(user);
    }

    return user;
  }

  constructor(
    @InjectRepository(Economy)
    private readonly economyRepository: Repository<Economy>,
    @InjectRepository(Guilds)
    private readonly guildsRepository: Repository<Guilds>,
    @InjectRepository(Shop)
    private readonly shopRepository: Repository<Shop>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(EconomyGuild)
    private readonly economyGuildRepository: Repository<EconomyGuild>,
  ) {}

  private async isEconomyEnabled(guildId: string): Promise<boolean> {
    const guild = (await this.getGuild(guildId)).systems[0];
    return guild.economy === true;
  }

  // 상점에서 아이템 구매
  async buyItem(
    userId: string,
    guildId: string,
    identifier: string,
  ): Promise<Result<Economy>> {
    if (!(await this.isEconomyEnabled(guildId))) {
      return fail('경제 시스템이 활성화되어 있지 않습니다.');
    }

    // 아이템 id로 아이템 정보 가져오기
    const item = await this.getItem(identifier, guildId);
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
  async sellItem(
    userId: string,
    guildId: string,
    identifier: string,
  ): Promise<Result<Economy>> {
    if (!(await this.isEconomyEnabled(guildId))) {
      return fail('경제 시스템이 활성화되어 있지 않습니다.');
    }

    // 아이템 id로 아이템 정보 가져오기
    const item = await this.getItem(identifier, guildId);
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
    user.inventory[0].item = user.inventory[0].item.filter(
      (inventoryItem) => inventoryItem !== item.name,
    );

    // 잔액과 인벤토리 업데이트
    const sellResult = await this.economyRepository.save(user);

    return success(`성공적으로 ${item.name}을 판매했습니다.`, sellResult);
  }

  // 상점에서 아이템 목록 가져오기
  async getShopItems(guildId: string): Promise<Result<EconomyGuild[]>> {
    if (!(await this.isEconomyEnabled(guildId))) {
      return fail('경제 시스템이 활성화되어 있지 않습니다.');
    }

    const items = await this.economyGuildRepository.find({ where: { guildId }, relations: ['shop', 'shop.items'] });

    return success('성공적으로 상점 아이템 목록을 가져왔습니다.', items);
  }

// 상점에 아이템 추가
async addShopItem(guildId: string, itemData: Item): Promise<Result<ShopDto>> {
  if (!(await this.isEconomyEnabled(guildId))) {
    return fail('경제 시스템이 활성화되어 있지 않습니다.');
  }

  // EconomyGuild와 Shop 데이터 로드
  const economyGuild = await this.economyGuildRepository.findOne({
    where: { guildId },
    relations: ['shop', 'shop.items'],
  });

  // 새 상점이 필요한 경우
  if (!economyGuild) {
    const newShop = this.shopRepository.create({
      name: '상점',
      items: [itemData],
    });
    const newEconomyGuild = this.economyGuildRepository.create({
      guildId,
      shop: newShop,
    });
    const savedEconomyGuild = await this.economyGuildRepository.save(newEconomyGuild);
    return success('성공적으로 아이템을 상점에 추가했습니다.', this.toEconomyGuildDto(savedEconomyGuild));
  } else {
    // 상점이 존재하지만 아이템이 없는 경우 처리
    if (!economyGuild.shop) {
      economyGuild.shop = this.shopRepository.create({
        name: '상점',
        items: [],
      });
    }

    // 아이템을 상점에 추가
    itemData.shop = economyGuild.shop;
    economyGuild.shop.items.push(itemData);

    // 데이터베이스에 아이템 저장
    await this.itemRepository.save(itemData);
    await this.shopRepository.save(economyGuild.shop);
    
    // 업데이트된 데이터 반환
    const updatedEconomy = await this.economyGuildRepository.save(economyGuild);
    return success('성공적으로 아이템을 상점에 추가했습니다.', this.toEconomyGuildDto(updatedEconomy));
  }
}


private toEconomyGuildDto(economyGuild: EconomyGuild): ShopDto {
    return {
        id: economyGuild.id,
        name: economyGuild.shop.name,
        items: economyGuild.shop.items.map(item => ({
            itemId: item.itemId,
            name: item.name,
            price: item.price,
            stock: item.stock,
        })),
    };
}

// 상점에서 아이템 삭제
async deleteShopItem(
  guildId: string,
  identifier: string,
): Promise<Result<void>> {
  if (!(await this.isEconomyEnabled(guildId))) {
    return fail('경제 시스템이 활성화되어 있지 않습니다.');
  }

  // 아이템 가져오기
  const item = await this.getItem(identifier, guildId);
  if (!item) {
    return fail('아이템을 찾을 수 없습니다.');
  }

  // 아이템 삭제
  await this.itemRepository.delete({ itemId: item.itemId });

  return success('성공적으로 상점 아이템을 삭제했습니다.');
}
  // 상점에서 아이템 수정
  async updateShopItem(
    guildId: string,
    itemId: string,
    updatedData: Partial<Item>,
  ): Promise<Result<EconomyGuild>> {
    if (!(await this.isEconomyEnabled(guildId))) {
      return fail('경제 시스템이 활성화되어 있지 않습니다.');
    }

    const existingItem = await this.getItem(itemId, guildId);

    if (!existingItem) {
      return fail('아이템을 찾을 수 없습니다.');
    }

    // 수정할 데이터를 기존 아이템에 적용
    Object.assign(existingItem, updatedData);

    // 수정된 아이템 저장
    await this.itemRepository.save(existingItem);

    // 해당 guildId의 Economy 정보를 다시 가져옵니다.
    const updatedEconomy = await this.economyGuildRepository.findOne({
      where: { guildId },
      relations: ['shop', 'shop.items'],
    });

    return success('성공적으로 상점 아이템을 수정했습니다.', updatedEconomy);
  }
}

import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ShopService } from './shop.service';
import { Economy } from '../entity/economy.entity';
import { Item } from '../entity/item.entity';

@Controller('shop')
export class ShopController {
    constructor(
        private readonly shopService: ShopService
    ) {}

    // 길드 상점 아이템 조회
    @Get("items/:guildId")
    async getShopItems(
        @Param("guildId") guildId: string
    ) {
        return await this.shopService.getShopItems(guildId);
    }

    // 길드 상점 아이템 구매
    @Post("buy")
    async buyItem(
        @Body() body: {
            userId: string,
            guildId: string,
            itemId: string
        }
    ) {
        return await this.shopService.buyItem(body.userId, body.guildId ,body.itemId);
    }

    // 길드 상점 아이템 판매
    @Post("sell")
    async sellItem(
        @Body() body: {
            userId: string,
            guildId: string,
            itemId: string
        }
    ) {
        return await this.shopService.sellItem(body.userId, body.guildId, body.itemId);
    }

    // 길드 상점 아이템 추가
    @Post("items/add")
    async addItem(
        @Body() body: {
            guildId: string,
            item: Item
        }
    ) {
        return await this.shopService.addShopItem(body.guildId, body.item);
    }

    // 길드 상점 아이템 삭제
    @Post("items/delete")
    async deleteItem(
        @Body() body: {
            guildId: string,
            itemId: string
        }
    ) {
        return await this.shopService.deleteShopItem(body.guildId, body.itemId);
    }

    // 길드 상점 아이템 수정
    @Post("items/update")
    async updateItem(
        @Body() body: {
            guildId: string,
            itemId: string,
            item: Item
        }
    ) {
        return await this.shopService.updateShopItem(body.guildId, body.itemId, body.item);
    }
}

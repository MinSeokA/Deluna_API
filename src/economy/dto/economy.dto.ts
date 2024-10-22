import { InventoryDto } from "./inventory.dto";
import { JobsDto } from "./jobs.dto";
import { ShopDto } from "./shop.dto";

export class EconomyDto {
    userId: string;
    balance: number;
    bank: number;
    guildId: string;

    inventory: InventoryDto[];
    job: JobsDto[];
    shop: ShopDto[];
    
    createdAt: Date;
}
export class ShopDto {
    id: number;
    item: string;
    price: number;
    description: string;
    image: string;
    type: string;
    stock: number;
    isLimited: boolean;
    createdAt: Date;
}
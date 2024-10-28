class ShopDto {
  id: number;
  name: string;
  items: ItemDto[];
}

class ItemDto {
  itemId: string;
  name: string;
  price: number;
  stock: number;
}

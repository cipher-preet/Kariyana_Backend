export interface IcartItem{
  productId: string;
  quantity: number;
  price: number;
}

export interface Icart  {
  userId: string;
  items: Array<IcartItem>;
  totalItems: number;
  subtotal: number;
  lastUpdatedAt: number;
}
import mongoose from "mongoose";

interface IOrder {
  productId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
}

export interface IOrderData {
  userId: string;
  items: IOrder[];
}

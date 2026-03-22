import mongoose from "mongoose";

interface IOrder {
  productId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
}

export interface IOrderData {
  userId: string;
  addressId: string;
  items: IOrder[];
}

export interface IAddressSchema {
  userId: object;
  name: string;
  phone: number;
  houseVillage: string;
  areaStreet: string;
  city: string;
  pincode: number;
  type: string;
}

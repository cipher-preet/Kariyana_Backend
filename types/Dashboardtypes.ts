import { Types } from "mongoose";

export interface IProduct {
  productId?:Types.ObjectId;
  name: string;
  sku: number;
  categoryId: Types.ObjectId;
  subcategoryId: Types.ObjectId;
  brandId: Types.ObjectId;
  mrp: number;
  sellingPrice: number;
  unit: string;
  quantityPerUnit: number;
  offPercentage: number;
  tag: string;
  images: Array<string>;
}

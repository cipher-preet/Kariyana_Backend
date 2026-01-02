import { Types } from "mongoose";

export interface IProduct {
  productId?: Types.ObjectId;
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

//-------------------------------------

export type VerifyOtpResult =
  | {
      success: false;
      status: number;
      message: string;
    }
  | {
      success: true;
      status: number;
      message: string;
      user: {
        id: string;
        role: string;
        phone: Number;
      };
    };

//-------------------------------------

export interface RegisterInput {
  phone: number;
  shopName: string;
  ownerName: string;
  address: string;
  gstNumber?: string;
  documents: {
    aadhar?: string | null;
    pan?: string | null;
    shopLicense?: string | null;
  };
}

//---------------------------------------

export interface IUnitInterface {
  _id?: string;
  name: string;
  shortName: string;
  baseUnit: string;
  multiplier?: number;
}

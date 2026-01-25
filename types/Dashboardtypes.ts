import { Types } from "mongoose";

export interface IProduct {
  productId?: Types.ObjectId;
  name: string;
  sku: number;
  categoryId: Types.ObjectId;
  subcategoryId: Types.ObjectId;
  brandId: Types.ObjectId;
  mrp: number;
  marketPrice?: number;
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
  name: string;
  dateofbirth: Date;
  address: string;
  shopName: string;
  Type: string;
  gstNumber?: string;
  tenureOfShop?: number;
  Dsale: number;
  Msales: number;
  documents: {
    shopPhotos?: string | null;
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

//---------------------------------------

export interface IProductHighlightsDetails {
  productId: Types.ObjectId;
  heighlights: Array<object>;
  images: string[];
}

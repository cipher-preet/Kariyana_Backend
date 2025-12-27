import mongoose, { Schema, Document } from "mongoose";

export interface IShopProfile extends Document {
  userId: mongoose.Types.ObjectId;
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

const ShopProfileSchema = new Schema<IShopProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    shopName: { type: String, required: true },
    ownerName: { type: String, required: true },
    address: { type: String, required: true },
    gstNumber: { type: String },

    documents: {
      aadhar: String,
      pan: String,
      shopLicense: String,
    },
  },
  { timestamps: true }
);

export const ShopProfileModel = mongoose.model<IShopProfile>(
  "ShopProfile",
  ShopProfileSchema
);

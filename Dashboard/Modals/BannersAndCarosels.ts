import mongoose, { Document } from "mongoose";

export interface IBannersAndCarosels extends Document {
  banners: Array<string>;
  carosels: Array<string>;
}

const BannersAndCaroselsSchema = new mongoose.Schema<IBannersAndCarosels>({
  banners: {
    type: [String],
    default: [],
  },
  carosels: {
    type: [String],
    default: [],
  },
});

export const BannersAndCaroselsModel = mongoose.model<IBannersAndCarosels>(
  "BannersAndCarosels",
  BannersAndCaroselsSchema,
);

import mongoose, { Types, Document } from "mongoose";

export interface Iinventory extends Document {
  productId: Types.ObjectId;
  minqty: number;
  maxqty: number;
  actualqty: number;
  usedqty: number;
}

const inventorySchema = new mongoose.Schema<Iinventory>(
  {
    productId: {
      type: Types.ObjectId,
      ref: "product",
    },
    minqty: {
      type: Number,
      default: 0,
    },
    maxqty: {
      type: Number,
      default: 0,
    },
    actualqty: {
      type: Number,
      default: 0,
    },
    usedqty: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export const inventoryModel = mongoose.model<Iinventory>(
  "inventory",
  inventorySchema
);

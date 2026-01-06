import mongoose, { Types, Document } from "mongoose";

export interface cartItem extends Document {
  productId: Types.ObjectId;
  quantity: number;
  price: number;
}

export interface cart extends Document {
  userId: Types.ObjectId;
  items: Array<cartItem>;
  totalItems: number;
  subtotal: number;
  lastUpdatedAt: number;
}

const cartItemSchema = new mongoose.Schema<cartItem>(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: false,
    },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema<cart>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },
    items: [cartItemSchema],
    totalItems: { type: Number, default: 0 },
    subtotal: { type: Number, default: 0 },
    lastUpdatedAt: { type: Number, default: Date.now },
  },
  { timestamps: true }
);

export const cartSchemaModel = mongoose.model<cart>("cart", cartSchema);

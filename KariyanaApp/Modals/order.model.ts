import mongoose from "mongoose";

interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
}

export interface IOrder extends mongoose.Document {
  userId: string;
  items: IOrderItem[];
  totalAmount: number;

  status: "created" | "pending" | "paid" | "failed";

  razorpayOrderId: string;
  razorpayPaymentId?: string;
}

const orderSchema = new mongoose.Schema<IOrder>(
  {
    userId: { type: String, required: true },

    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String,
        price: Number,
        quantity: Number,
      },
    ],

    totalAmount: Number,

    status: {
      type: String,
      default: "created",
    },

    razorpayOrderId: String,
    razorpayPaymentId: String,
  },
  { timestamps: true },
);

export const Order = mongoose.model<IOrder>("Order", orderSchema);

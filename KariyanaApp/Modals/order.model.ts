import mongoose, { Types } from "mongoose";

interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
}

export interface IOrder extends mongoose.Document {
  userId: Types.ObjectId;
  addressId: Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;

  status: "created" | "pending" | "paid" | "failed";

  orderStatus:
    | "Recieved"
    | "packing"
    | "packed"
    | "outForDelivery"
    | "Delivered"
    | "cancelled";

  razorpayOrderId: string;
  razorpayPaymentId?: string;

  rating?: number;
  review?: string;
}

const orderSchema = new mongoose.Schema<IOrder>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    addressId: { type: mongoose.Schema.Types.ObjectId, ref: "DileveryAddress" },

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

    orderStatus: {
      type: String,
      enum: [
        "Recieved",
        "packing",
        "packed",
        "outForDelivery",
        "Delivered",
        "cancelled",
      ],
    },

    razorpayOrderId: String,
    razorpayPaymentId: String,

    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 0,
    },

    review: String,
  },
  { timestamps: true },
);

export const Order = mongoose.model<IOrder>("Order", orderSchema);

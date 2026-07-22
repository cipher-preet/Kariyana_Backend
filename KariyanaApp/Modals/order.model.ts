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
    | "cancelled"
    | "Rated";

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
        "Rated",
      ],
      default: "Recieved",
    },

    razorpayOrderId: String,
    razorpayPaymentId: String,

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    review: String,
  },
  { timestamps: true },
);

orderSchema.index({ createdAt: 1, status: 1 });

export const Order = mongoose.model<IOrder>("Order", orderSchema);

export type OrderStatus = IOrder["orderStatus"];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  Recieved: "Received",
  packing: "Packing",
  packed: "Packed",
  outForDelivery: "Out for Delivery",
  Delivered: "Delivered",
  cancelled: "Cancelled",
  Rated: "Rated",
};

export const normalizeOrderStatus = (status?: string | null): OrderStatus => {
  const value = String(status || "").trim().toLowerCase();

  switch (value) {
    case "received":
    case "recieved":
    case "order":
    case "placed":
    case "created":
      return "Recieved";
    case "packing":
    case "processing":
    case "inprogress":
    case "in_progress":
      return "packing";
    case "packed":
    case "confirmed":
      return "packed";
    case "outfordelivery":
    case "out_for_delivery":
    case "out for delivery":
    case "dispatched":
      return "outForDelivery";
    case "delivered":
    case "complete":
    case "completed":
    case "done":
    case "orders":
      return "Delivered";
    case "cancelled":
    case "canceled":
      return "cancelled";
    case "rated":
      return "Rated";
    default:
      return "Recieved";
  }
};

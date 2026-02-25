import mongoose, { Types, Document } from "mongoose";

export interface contactus extends Document {
  name: string;
  address: string;
  phone: number;
  query: string;
  message: string;
  isAction: boolean;
}

const contactusSchema = new mongoose.Schema<contactus>(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    phone: {
      type: Number,
      required: true,
    },
    query: {
      type: String,
    },
    message: {
      type: String,
    },
    isAction: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const contactModal = mongoose.model<contactus>(
  "contactusTabel",
  contactusSchema,
);

import mongoose, { Types, Document } from "mongoose";

export interface IBrand extends Document {
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BrandSchema = new mongoose.Schema<IBrand>({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  description: {
    type: String,
  },

  isActive: {
    type: Boolean,
    default: false,
  },
});

export const BrandModel = mongoose.model<IBrand>("Brand", BrandSchema);

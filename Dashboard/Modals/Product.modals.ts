import mongoose, { Types, Document } from "mongoose";

export interface product extends Document {
  name: string;
  sku: number;
  categoryId: Types.ObjectId;
  subcategoryId: Types.ObjectId;
  brandId: Types.ObjectId;
  mrp: number;
  sellingPrice: number;
  rating: number;
  isActive: boolean;
  reviewCount: number;
  unit: string;
  quantityPerUnit: number;
  tag: string;
  offPercentage: number;
  images: [string];
}

const ProductSchema = new mongoose.Schema<product>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    images: {
      type: [String],
    },
    sku: {
      type: Number,
      required: true,
    },

    categoryId: {
      type: Types.ObjectId,
      ref: "ParentCategory",
      required: true,
    },

    subcategoryId: {
      type: Types.ObjectId,
      ref: "ChildCategory",
      required: true,
    },

    brandId: {
      type: Types.ObjectId,
      ref: "Brand",
      required: true,
    },

    mrp: {
      type: Number,
      required: true,
      min: 0,
    },

    sellingPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    unit: {
      type: String,
      required: true,
    },

    quantityPerUnit: {
      type: Number,
      required: true,
      min: 1,
    },

    tag: {
      type: String,
      trim: true,
    },

    offPercentage: {
      type: Number,
      min: 0,
      max: 100,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const productModel = mongoose.model<product>("product", ProductSchema);

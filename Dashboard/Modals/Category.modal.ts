import mongoose, { Schema, Types, Document } from "mongoose";

export interface ParentCategory extends Document {
  name: string;
  image: string;
  isActive: boolean;
}

const ParentCategorySchema = new mongoose.Schema<ParentCategory>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: true,
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

export const ParentCategoryModel = mongoose.model<ParentCategory>(
  "ParentCategory",
  ParentCategorySchema
);

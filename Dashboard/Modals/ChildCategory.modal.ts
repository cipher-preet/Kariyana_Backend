import mongoose, { Schema, Types, Document } from "mongoose";

export interface childCategory extends Document {
  name: string;
  image: string;
  isActive: boolean;
  parentCategoryId: Object;
}

const childCategorySchema = new mongoose.Schema<childCategory>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    parentCategoryId: {
      type: Types.ObjectId,
      ref: "ParentCategory",
    },
    image: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const childCategoryModel = mongoose.model<childCategory>(
  "ChildCategory",
  childCategorySchema
);

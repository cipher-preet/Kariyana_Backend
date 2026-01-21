import mongoose, { Types, Document } from "mongoose";

export interface ITag extends Document {
  name: string;
  isActive: boolean;
}

const TagSchema = new mongoose.Schema<ITag>({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

export const TagModel = mongoose.model<ITag>("Tag", TagSchema);

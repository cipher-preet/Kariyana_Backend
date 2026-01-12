import mongoose, { Document } from "mongoose";

export interface IUnit extends Document {
  name: string;
  shortName: string;
  baseUnit?: string;
  multiplier?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UnitSchema = new mongoose.Schema<IUnit>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    shortName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    baseUnit: {
      type: String, // example: kg for g
    },
    multiplier: {
      type: Number, // example: 0.001 for g → kg
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  }
);

export const UnitModal = mongoose.model<IUnit>("Unit", UnitSchema);

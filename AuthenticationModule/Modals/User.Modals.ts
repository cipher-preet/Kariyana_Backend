import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  phone: Number;
  role: "ADMIN" | "VENDOR" | "BUYER";
  isActive: boolean;
  status: "PENDING" | "APPROVED" | "REJECTED";
  firebaseUid: string;
}

const UserSchema = new Schema<IUser>(
  {
    phone: { type: Number, unique: true, required: true },
    firebaseUid:{type:String,unique:true},
    role: { type: String, enum: ["BUYER", "ADMIN"], default: "BUYER" },
    isActive: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", UserSchema);

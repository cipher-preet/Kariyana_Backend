import mongoose, { Schema, Document } from "mongoose";

export interface IOtp extends Document {
  userId: mongoose.Types.ObjectId;
  otpHash: number | undefined;
  expiresAt: Date;
  attempts: number;
}

const OtpSchema = new Schema<IOtp>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    otpHash: { type: Number, required: true },
    expiresAt: { type: Date, required: true },
    attempts: { type: Number, default: 0 },
  },
  { timestamps: true }
);

OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 3600 });

export const Otp = mongoose.model<IOtp>("Otp", OtpSchema);

import mongoose, { Types } from "mongoose";

interface Ifeedback extends mongoose.Document {
  userId: Types.ObjectId;
  rating: number;
  type: string;
  feedback: string;
  images: string[];
}

const FeedbackSchema = new mongoose.Schema<Ifeedback>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    rating: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
    },
    feedback: {
      type: String,
    },
    images: {
      type: [String],
    },
  },
  { timestamps: true },
);

export const FeedBack = mongoose.model<Ifeedback>(
  "AppFeedBack",
  FeedbackSchema,
);

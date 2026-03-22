import mongoose, { Types } from "mongoose";

interface IAdrres extends mongoose.Document {
  userId: object;
  name: string;
  phone: number;
  houseVillage: string;
  areaStreet: string;
  city: string;
  pincode: number;
  type: string;
}

const AddressSchema = new mongoose.Schema<IAdrres>({
  userId: { type: Types.ObjectId, required: true },

  name: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  houseVillage: {
    type: String,
    required: true,
  },
  areaStreet: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  pincode: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

export const DileveryAddress = mongoose.model<IAdrres>(
  "DileveryAddress",
  AddressSchema,
);

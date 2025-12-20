import mongoose, { Types, Document } from "mongoose";

export interface productDetails extends Document {
  productId: Types.ObjectId;
  heighlights: Array<object>;
}

const productDetailSchema = new mongoose.Schema<productDetails>(
  {
    productId: {
      type: Types.ObjectId,
      ref: "product",
    },
    heighlights: [
      {
        heading: {
          type: String,
        },
        description: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true
  }
);

export const productDetailsModel = mongoose.model<productDetails>(
  "productdetails",
  productDetailSchema
);

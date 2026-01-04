import mongoose, { Types, Document } from "mongoose";

export interface productDetails extends Document {
  productId: Types.ObjectId;
  heighlights: Array<object>;
  images: string[];
}

const productDetailSchema = new mongoose.Schema<productDetails>(
  {
    productId: {
      type: Types.ObjectId,
      ref: "product",
    },
    images:{
      type: [String],
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
);

export const productDetailsModel = mongoose.model<productDetails>(
  "productdetails",
  productDetailSchema
);

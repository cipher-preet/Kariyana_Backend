import { Types } from "mongoose";
import { STATUS_CODE } from "../../Api";
import { productModel } from "../../Dashboard/Modals/Product.modals";

interface PaginationParams {
  limit?: number;
  cursor?: string;
}

export const getProductsBycategoryIdRepository = async (
  categoryId: string,
  { limit = 10, cursor }: PaginationParams
) => {
  try {
    const query: any = {
      categoryId: new Types.ObjectId(categoryId),
      isActive: true,
    };

    if (cursor) {
      query._id = { $lt: new Types.ObjectId(cursor) };
    }

    const products = await productModel
      .find(query)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .select({
        name: 1,
        images: 1,
        mrp: 1,
        sellingPrice: 1,
        unit: 1,
        quantityPerUnit: 1,
        tag: 1,
        offPercentage: 1,
      })
      .lean();

    const hasNextPage = products.length > limit;

    if (hasNextPage) {
      products.pop();
    }

    return {
      products,
      nextCursor: hasNextPage ? products[products.length - 1]._id : null,
      hasNextPage,
    };                                                                                      
  } catch (error) {
    console.log("error in product repo ", error);
    throw error;
  }
};

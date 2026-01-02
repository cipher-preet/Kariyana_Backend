import { Types } from "mongoose";
import { STATUS_CODE } from "../../Api";
import { productModel } from "../../Dashboard/Modals/Product.modals";
import { ParentCategoryModel } from "../../Dashboard/Modals/Category.modal";
import { generateCloudFrontSignedUrl } from "../../utils/cloudfrontSigner";
import { childCategoryModel } from "../../Dashboard/Modals/ChildCategory.modal";

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

//--------------------------------------------------------------------------------------------

export const getAllChildCategoriesRepository = async () => {
  try {
    const response = await childCategoryModel
      .find()
      .populate({ path: "parentCategoryId", select: "name" })
      .select("name image isActive")
      .lean();

    if (!response) {
      return {
        status: STATUS_CODE.NOT_FOUND,
        message: "Categories not Found",
      };
    }

    const categoriesWithSignedUrls = response.reduce(
      (acc: { [key: string]: any[] }, item) => {
        const parentName = (item.parentCategoryId as { name: string }).name;

        if (!acc[parentName]) {
          acc[parentName] = [];
        }
        acc[parentName].push({
          _id: item._id,
          name: item.name,
          isActive: item.isActive,
          images: generateCloudFrontSignedUrl(item.image),
        });

        return acc;
      },
      {}
    );

    return categoriesWithSignedUrls;
  } catch (error) {
    console.log("error in product repo ", error);
    throw error;
  }
};

//-----------------------------------------------------------------------------------------------------

export const getProductByChildCategoryIdRepository = async (
  childCatId: string,
  { limit = 10, cursor }: PaginationParams
) => {
  try {
    const query: any = {
      subcategoryId: new Types.ObjectId(childCatId),
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
        images: { $slice: 1 },
        mrp: 1,
        sellingPrice: 1,
        unit: 1,
        quantityPerUnit: 1,
        tag: 1,
        offPercentage: 1,
        rating: 1,
      })
      .lean();

      // console.log(products)

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

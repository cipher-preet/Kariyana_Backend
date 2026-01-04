import { Types } from "mongoose";
import { STATUS_CODE } from "../../Api";
import { productModel } from "../../Dashboard/Modals/Product.modals";
import { ParentCategoryModel } from "../../Dashboard/Modals/Category.modal";
import { generateCloudFrontSignedUrl } from "../../utils/cloudfrontSigner";
import { childCategoryModel } from "../../Dashboard/Modals/ChildCategory.modal";
import { cartSchemaModel } from "../../Dashboard/Modals/cart.model";
import { productDetailsModel } from "../../Dashboard/Modals/ProductDetails.modal";
import { Icart } from "../../types/CartTypes";

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
        reviewCount: 1,
        unit: 1,
        quantityPerUnit: 1,
        rating: 1,
        marketPrice: 1,
        sku: 1,
        subcategoryId: 1,
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

//------------------------------------------------------------------------------------

export const syncCartRepository = async (FinalData: Icart) => {
  try {
    const cart = await cartSchemaModel.findOneAndUpdate(
      { userId: FinalData.userId },
      {
        $set: {
          items: FinalData.items,
          totalItems: FinalData.totalItems,
          subtotal: FinalData.subtotal,
          lastUpdatedAt: FinalData.lastUpdatedAt,
        },
      },
      { new: true, upsert: true }
    );

    if (!cart) {
      return {
        status: STATUS_CODE.INTERNAL_SERVER_ERROR,
        message: "Failed to sync cart",
      };
    }

    return {
      status: STATUS_CODE.OK,
      message: "Cart updated successfully",
    };
  } catch (error) {
    console.log("error in product repo ", error);
    throw error;
  }
};

//------------------------------------------------------------------------------------
type PopulatedProduct = {
  _id: Types.ObjectId;
  name: string;
  images: string[];
  unit: string;
  quantityPerUnit: string;
};

type CartItemPopulated = {
  productId: PopulatedProduct;
  quantity: number;
  price: number;
};

type CartPopulated = {
  userId: Types.ObjectId;
  items: CartItemPopulated[];
  totalItems: number;
  subtotal: number;
  lastUpdatedAt: number;
};

export const getCartByUserIdRepository = async (userId: string) => {
  try {
    const cart = await cartSchemaModel
      .findOne({ userId: userId })
      .populate({
        path: "items.productId",
        select: "name images unit quantityPerUnit",
      })
      .lean<CartPopulated>();

    if (!cart) {
      return {
        status: STATUS_CODE.NOT_FOUND,
        message: "Cart not found",
      };
    }

    const FinalResponse = {
      userId: cart?.userId,
      items: cart?.items.map((item) => {
        const { images, ...productWithoutImages } = item.productId as any;

        return {
          productId: productWithoutImages._id,
          name: productWithoutImages.name,
          quantity: item.quantity,
          price: item.price,
          image: images?.length ? generateCloudFrontSignedUrl(images[0]) : null,
          unit: productWithoutImages.unit,
          quantityPerUnit: productWithoutImages.quantityPerUnit,
        };
      }),
      totalItems: cart?.totalItems,
      subtotal: cart?.subtotal,
      lastUpdatedAt: cart?.lastUpdatedAt,
    };

    return FinalResponse;
  } catch (error) {
    console.log("error in product repo ", error);
    throw error;
  }
};

import { Types } from "mongoose";
import { STATUS_CODE } from "../../Api";
import {
  IProduct,
  IProductHighlightsDetails,
} from "../../types/Dashboardtypes";
import { productModel } from "../Modals/Product.modals";
import { NoSuchKey } from "@aws-sdk/client-s3";
import { productDetailsModel } from "../Modals/ProductDetails.modal";
import { generateCloudFrontSignedUrl } from "../../utils/cloudfrontSigner";
import path from "path";
// ------------------------------------------------------------------------------------------------

export const addNewProductRepository = async (finalData: IProduct) => {
  try {
    const response = await productModel.create(finalData);

    if (!response) {
      return {
        status: STATUS_CODE.BAD_REQUEST,
        message: "Server error while creating the Product",
      };
    }

    return {
      status: STATUS_CODE.OK,
      message: "Product created Successfully",
    };
  } catch (error) {
    console.log("error in product repository", error);
    throw error;
  }
};

//------------------------------------------------------------------------------------------------

export const editProductRepository = async (
  finalData: IProduct,
  productId: string
) => {
  try {
    const response = await productModel.findByIdAndUpdate(
      productId,
      { $set: finalData },
      { new: true }
    );

    if (!response) {
      return {
        status: STATUS_CODE.BAD_REQUEST,
        message: "Server error while updating the Product",
      };
    }

    return {
      status: STATUS_CODE.OK,
      message: "Product update Successfully",
    };
  } catch (error) {
    console.log("error in product repository", error);
    throw error;
  }
};

//-------------------------------------------------------------------------------------------------]

export const getProductsBasicDetailsRepository = async (
  limit: number = 10,
  cursor?: string
) => {
  try {
    const query: any = {
      isActive: true,
    };

    if (cursor) {
      query._id = { $lt: new Types.ObjectId(cursor) };
    }

    const products = await productModel
      .find(query)
      .populate([
        { path: "categoryId", select: "name" },
        { path: "brandId", select: "name" },
        { path: "subcategoryId", select: "name" },
      ])
      .sort({ _id: -1 })
      .limit(limit + 1)
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
    console.log("error in product repository", error);
    throw error;
  }
};

//-------------------------------------------------------------------------------------------------

export const addProductImagsAndHiglightsRepository = async (
  finalData: IProductHighlightsDetails
) => {
  try {
    const response = await productDetailsModel.create(finalData);

    if (!response) {
      return {
        status: STATUS_CODE.BAD_REQUEST,
        message: "Server error while updating the Product",
      };
    }

    return {
      status: STATUS_CODE.OK,
      message: "Product update Successfully",
    };
  } catch (error) {}
};

//-------------------------------------------------------------------------------------------------

export const getProductImagesAndHighlightsRepository = async (
  productId: string
) => {
  try {
    const response = await productDetailsModel
      .findOne({ productId: productId })
      .lean();

    if (!response) {
      return {
        status: STATUS_CODE.NOT_FOUND,
        message: "No product details found",
      };
    }

    const signedImageUrls = response.images.map((imageKey: string) =>
      generateCloudFrontSignedUrl(imageKey)
    );

    const updatedResponse = {
      ...response,
      images: signedImageUrls,
    };

    return {
      status: STATUS_CODE.OK,
      data: updatedResponse,
    };
  } catch (error) {
    console.log("error in product repository", error);
    throw error;
  }
};

import mongoose, { Types } from "mongoose";
import { STATUS_CODE } from "../../Api";
import {
  IProduct,
  IProductHighlightsDetails,
} from "../../types/Dashboardtypes";
import { productModel, product } from "../Modals/Product.modals";
import { productDetailsModel } from "../Modals/ProductDetails.modal";
import { generateCloudFrontSignedUrl } from "../../utils/cloudfrontSigner";
import { homePageModel } from "../Modals/BuilfHomePage.modal";
import { BannersAndCaroselsModel } from "../Modals/BannersAndCarosels";
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
  productId: string,
) => {
  try {
    const response = await productModel.findByIdAndUpdate(
      productId,
      { $set: finalData },
      { new: true },
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
  cursor?: string,
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
  finalData: IProductHighlightsDetails,
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
  productId: string,
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
      generateCloudFrontSignedUrl(imageKey),
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

//------------------------------------------------------------------------------------------------------------------------------

export const getProductBasicInfoByChildCategoryIdrepository = async (
  childCategoryId: string,
) => {
  try {
    const query: any = {
      subcategoryId: childCategoryId,
      isActive: true,
    };
    const products = await productModel
      .find(query)
      .limit(20)
      .select("name images mrp")
      .lean();
    if (!products) {
      return [];
    }
    return products;
  } catch (error) {
    console.log("this is the error in category repository ", error);
    throw error;
  }
};

//-------------------------------------------------------------------------------------------------------------

export const buildHomePageRepository = async (
  homepageDetails: Array<object>,
) => {
  try {
    const producIds = [
      ...new Set(
        homepageDetails
          .flatMap((item: any) => item.products || [])
          .map((id) => new Types.ObjectId(id)),
      ),
    ];

    if (!producIds.length) {
      return {
        status: STATUS_CODE.BAD_REQUEST,
        message: "No products found to build homepage",
      };
    }

    const products = await productModel
      .find({
        _id: { $in: producIds },
        isActive: true,
      })
      .select(
        "_id name images mrp sellingPrice reviewCount unit quantityPerUnit rating marketPrice sku",
      )
      .lean();

    const productMap = new Map<string, any>();

    products.forEach((product) => {
      productMap.set(product._id.toString(), {
        _id: product._id,
        name: product.name,
        images: product.images[0],
        mrp: product.mrp,
        sellingPrice: product.sellingPrice,
        reviewCount: product.reviewCount,
        unit: product.unit,
        quantityPerUnit: product.quantityPerUnit,
        rating: product.rating,
        marketPrice: product.marketPrice,
        sku: product.sku,
      });
    });

    const finalSection = homepageDetails.map((section: any) => ({
      categoryId: new Types.ObjectId(section.categoryId),
      categoryName: section.categoryName,
      products: section.products
        .map((pid: string) => productMap.get(pid))
        .filter(Boolean),
    }));

    const bulkOps = finalSection.map((section) => ({
      updateOne: {
        filter: { categoryId: section.categoryId },
        update: { $set: section },
        upsert: true,
      },
    }));

    await homePageModel.bulkWrite(bulkOps);

    return {
      status: STATUS_CODE.OK,
      message: "Homepage built successfully",
    };
  } catch (error) {
    console.log("this is the error in category repository ", error);
    throw error;
  }
};

//---------------------------------------------------------------------------------------------------------------------

export const getHomePageDetailsForDashboardRepository = async () => {
  try {
    const response = await homePageModel.find({}).lean();

    if (!response) {
      return [];
    }

    const finalResult = response.map((section) => ({
      categoryId: section.categoryId,
      categoryName: section.categoryName,
      products: section.products.map((product) => ({
        _id: product._id,
        name: product.name,
        images: generateCloudFrontSignedUrl(product.images),
        mrp: product.mrp,
      })),
    }));

    return finalResult;
  } catch (error) {
    console.log("this is the error in category repository ", error);
    throw error;
  }
};

//-----------------------------------------------------------------------------------------------------------------

export const addProductCaresolsAndbannersRepository = async (
  banners: Array<string>,
  carosels: Array<string>,
  keepBanners: Array<string>,
  keepCarosels: Array<string>,
) => {
  try {
    const existingDoc = await BannersAndCaroselsModel.findOne({});

    const finalBanners = [...keepBanners, ...banners];
    const finalCarosels = [...keepCarosels, ...carosels];
    const uniqueBanners = Array.from(new Set(finalBanners));
    const uniqueCarosels = Array.from(new Set(finalCarosels));

    let response;

    if (existingDoc) {
      response = await BannersAndCaroselsModel.findOneAndUpdate(
        { _id: existingDoc._id },
        {
          $set: {
            banners: uniqueBanners,
            carosels: uniqueCarosels,
          },
        },
        { new: true },
      );
    } else {
      response = await BannersAndCaroselsModel.create({
        banners: uniqueBanners,
        carosels: uniqueCarosels,
      });
    }

    if (!response) {
      return {
        status: STATUS_CODE.BAD_REQUEST,
        message: "Failed to save banners and carousels",
      };
    }

    return {
      status: STATUS_CODE.OK,
      message: "Banners and carousels saved successfully",
      data: response,
    };
  } catch (error) {
    console.log("this is the error in category repository ", error);
    throw error;
  }
};

import { STATES, Types } from "mongoose";
import { ItrendData } from "../../types/TrendType";
import { product, productModel } from "../Modals/Product.modals";
import { TrendModel } from "../Modals/Trend.modal";
import { STATUS_CODE } from "../../Api";

export const createTrendsRepository = async (finalData: ItrendData) => {
  try {
    if (!finalData.productId || finalData.productId.length === 0) {
      return {
        status: STATUS_CODE.BAD_REQUEST,
        message: "No product IDs provided",
      };
    }

    const productDetails = await productModel
      .find({
        _id: { $in: finalData.productId },
      })
      .select(
        "_id name images mrp sellingPrice reviewCount unit quantityPerUnit rating marketPrice sku",
      )
      .lean();

    if (!productDetails.length) {
      return {
        status: STATUS_CODE.NOT_FOUND,
        message: "No valid products found",
      };
    }

    const finalTrendData = {
      trendDescription: finalData.trendDescription,
      TrendName: finalData.trendName,
      products: productDetails.map((product) => ({
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
      })),
    };

    await TrendModel.create(finalTrendData);

    return {
      status: STATUS_CODE.OK,
      message: "Trend created successfully",
    };
  } catch (error) {
    console.log("Error in createTrendsRepository", error);
    throw error;
  }
};

//---------------------------------------------------------------------------------------------------------

export const getProductsForTrendBuildingRepository = async (
  cursorcomming: string,
  limit: number,
  search: string,
) => {
  try {
    const query: any = {
      isActive: true,
    };

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (cursorcomming) {
      query._id = { $lt: new Types.ObjectId(cursorcomming) };
    }

    const products = await productModel
      .find(query)
      .sort({ _id: -1 })
      .limit(Number(limit + 1))
      .select("name mrp");

    const hasNextPage = products.length > limit;

    if (hasNextPage) {
      products.pop();
    }

    return {
      data: products,
      nextCursor: hasNextPage ? products[products.length - 1]._id : null,
      hasNextPage,
    };
  } catch (error) {
    console.log("Error in createTrendsRepository", error);
    throw error;
  }
};

//-----------------------------------------------------------------------------------------

export const getTrendsForDashboardRepository = async () => {
  try {
    const trends = await TrendModel.find().lean();

    if (!trends.length) {
      return [];
    }
    const finalTrends = trends.map((trend) => ({
      _id: trend._id,
      TrendName: trend.TrendName,
      products: trend.products.map((product) => ({
        _id: product._id,
        name: product.name,
        mrp: product.mrp,
      })),
    }));
    return finalTrends || [];
  } catch (error) {
    console.log("Error in getTrendsForDashboardRepository", error);
    throw error;
  }
};

//-----------------------------------------------------------------------------------------

export const deleteTrendsFromDashboardRepository = async (trendId: string) => {
  try {
    const response = await TrendModel.findByIdAndDelete(trendId);

    if (!response) {
      return {
        status: STATUS_CODE.NOT_FOUND,
        message: "Trend not found",
      };
    }
    return {
      status: STATUS_CODE.OK,
      message: "Trend deleted successfully",
    };
  } catch (error) {
    console.log("Error in deleteTrendsFromDashboardRepository", error);
    throw error;
  }
};

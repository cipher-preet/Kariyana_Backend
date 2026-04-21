import { ErrorResponse, STATUS_CODE, SuccessResponse } from "../../Api";
import { NextFunction, Request, Response } from "express";
import {
  getProductsBycategoryIdService,
  getAllChildCategoriesServices,
  getProductByChildCategoryIdServices,
  syncCartService,
  getCartByUserIdService,
  incAndDecCartQuantityServices,
  getHomePageBannerAndProductServices,
  getParentcatandTagDataServices,
  getTrendSectionDataForHomePageServices,
  getRandomProductsForCartPageServices,
  searchProductService,
  getOrderDetailByuserIdServices,
  getProductsbyProductIdService,
  getOrderDetailWithOrderIdServices,
  userRatingProductsServices,
  shareAppFeedbackServices,
  getPersonalInformationByUserIdServices,
  emptyCartAfterCheckoutServices,
} from "../Services/Productapp.services";

import { generateCloudFrontSignedUrl } from "../../utils/cloudfrontSigner";
import { Icart } from "../../types/CartTypes";
import mongoose, { PreMiddlewareFunction } from "mongoose";
import { SearchQuery } from "../../types/Search";
import { IFeedback } from "../../types/Dashboardtypes";
//----------------------------------------------------------------------------------
const getProductsBycategoryIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const categoryId = req.params.categoryId as string;
    const { cursor } = req.query;

    const limit = Math.min(Number(req.query.limit) || 10, 50);

    const response = await getProductsBycategoryIdService(
      categoryId,
      limit,
      cursor as string | undefined,
    );

    const productsWithSignedUrls = response.products.map((product: any) => ({
      ...product,
      images: generateCloudFrontSignedUrl(product.images[0]),
    }));

    SuccessResponse(res, STATUS_CODE.OK, {
      products: productsWithSignedUrls,
      nextCursor: response.nextCursor,
      hasNextPage: response.hasNextPage,
    });
  } catch (error) {
    next(error);
  }
};

//--------------------------------------------------------------------------------------------]

const getProductsbyProductIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const productId = req.params.productId as string;

    console.log("productId in controller", productId);

    const response = await getProductsbyProductIdService(productId);

    if ((response as { status: number }).status === STATUS_CODE.NOT_FOUND) {
      return ErrorResponse(
        res,
        (response as { status: number }).status,
        (response as { message: string }).message,
      );
    }

    return SuccessResponse(res, STATUS_CODE.OK, response);
  } catch (error) {
    next(error);
  }
};

//---------------------------------------------------------------------------------------------

const getAllChildCategoriesController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const response = await getAllChildCategoriesServices();

    if ((response as { status: number }).status === STATUS_CODE.NOT_FOUND) {
      return ErrorResponse(
        res,
        (response as { status: number }).status,
        "error while editing child Category",
      );
    }

    SuccessResponse(res, STATUS_CODE.OK, response);
  } catch (error) {
    next(error);
  }
};

//--------------------------------------------------------------------------------------

const getProductByChildCategoryIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const childCatId = req.params.childCatId as string;

    const { cursor } = req.query;

    const limit = Math.min(Number(req.query.limit) || 10, 50);

    const response: any = await getProductByChildCategoryIdServices(
      childCatId,
      limit,
      cursor as string | undefined,
    );

    const productsWithSignedUrls = response.products.map((product: any) => ({
      ...product,
      images: generateCloudFrontSignedUrl(product.images[0]),
    }));

    SuccessResponse(res, STATUS_CODE.OK, {
      products: productsWithSignedUrls,
      nextCursor: response.nextCursor,
      hasNextPage: response.hasNextPage,
    });
  } catch (error) {
    next(error);
  }
};
//----------------------------------------------------------------------------------------------------------

const syncCartController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId, items, totalItems, subtotal, lastUpdatedAt } = req.body;

    if (!userId) {
      return ErrorResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        "Invalid request body",
      );
    }

    const itemsArray = Object.values(items).map((item: any) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    }));

    const FinalData: Icart = {
      userId,
      items: itemsArray,
      totalItems,
      subtotal,
      lastUpdatedAt,
    };
    const response = await syncCartService(FinalData);

    if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
      return ErrorResponse(res, response.status, response.message);
    }

    SuccessResponse(res, response.status, response.message);
  } catch (error) {
    next(error);
  }
};

//-----------------------------------------------------------------------------------------------

const getCartByUserIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const userId = req.params.userId as string;

    const response = await getCartByUserIdService(userId);

    if (!userId) {
      return ErrorResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        "Invalid request parameters",
      );
    }

    if ((response as { status: number }).status === STATUS_CODE.NOT_FOUND) {
      return ErrorResponse(
        res,
        (response as { status: number }).status,
        (response as { message: string }).message,
      );
    }

    SuccessResponse(res, STATUS_CODE.OK, response);
  } catch (error) {
    next(error);
  }
};

//----------------------------------------------------------------------------------------------------

const incAndDecCartQuantityController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { userId, productId, delta } = req.body;

    const response = await incAndDecCartQuantityServices(
      userId,
      productId,
      delta,
    );

    if ((response as { status: number }).status === STATUS_CODE.BAD_REQUEST) {
      return ErrorResponse(
        res,
        (response as { status: number }).status,
        (response as { message: string }).message,
      );
    }

    SuccessResponse(res, STATUS_CODE.OK, response);
  } catch (error) {
    next(error);
  }
};

//----------------------------------------------------------------------------------------------------------------------

const getHomePageBannerAndProductController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 2, 5);
    let cursor: string | null = null;

    if (
      typeof req.query.cursor === "string" &&
      mongoose.Types.ObjectId.isValid(req.query.cursor)
    ) {
      cursor = req.query.cursor;
    }
    const response = await getHomePageBannerAndProductServices(limit, cursor);
    return SuccessResponse(res, STATUS_CODE.OK, response);
  } catch (error) {
    next(error);
  }
};

//--------------------------------------------------------------------------------------------

const getParentcatandTagDataController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const response = await getParentcatandTagDataServices();
    const productsWithSignedUrls = response.map((cat: any) => ({
      ...cat,
      image: generateCloudFrontSignedUrl(cat.images),
    }));
    return SuccessResponse(res, STATUS_CODE.OK, productsWithSignedUrls);
  } catch (error) {
    next(error);
  }
};

//----------------------------------------------------------------------------------------------

const getTrendSectionDataForHomePageController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { cursor } = req.query;
    const limit = Math.min(Number(req.query.limit) || 5, 10);

    const response = await getTrendSectionDataForHomePageServices(
      limit,
      cursor as string | undefined,
    );

    const productsWithSignedUrls = response.trends.map((trend: any) => ({
      ...trend,
      products: trend.products?.map((product: any) => ({
        ...product,
        images: generateCloudFrontSignedUrl(product.images),
      })),
    }));

    SuccessResponse(res, STATUS_CODE.OK, {
      products: productsWithSignedUrls,
      nextCursor: response.nextCursor,
      hasNextPage: response.hasNextPage,
    });
  } catch (error) {
    next(error);
  }
};

//--------------------------------------------------------------------------------------------------------------

const getRandomProductsForCartPageController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const response = await getRandomProductsForCartPageServices();

    const productsWithSignedUrls = response.map((product: any) => ({
      ...product,
      images: generateCloudFrontSignedUrl(product.images[0]),
    }));

    SuccessResponse(res, STATUS_CODE.OK, {
      products: productsWithSignedUrls,
    });
  } catch (error) {
    next(error);
  }
};

//-------------------------------------------------------------------------------------------------------------------------------------

const searchProductController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const {
      q,
      page,
      limit,
      minPrice,
      maxPrice,
      category,
      brand,
      sort = "relevance",
    } = req.query;

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;

    const finalQuery: SearchQuery = {
      q: q ? String(q) : undefined,
      page: pageNumber,
      limit: limitNumber,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      category: category ? String(category) : undefined,
      brand: brand ? String(brand) : undefined,
      sort: sort ? String(sort) : "relevance",
    };

    const response = await searchProductService(finalQuery);

    const productsWithSignedUrls = response.products.map((product: any) => ({
      ...product,
      images: generateCloudFrontSignedUrl(product.images[0]),
    }));

    return SuccessResponse(res, STATUS_CODE.OK, productsWithSignedUrls);
  } catch (error) {
    next(error);
  }
};

//-------------------------------------------------------------------------------------------------------------------------------------

const getOrderDetailByuserIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const userId = req.query.userId as string;
    const cursor = req.query.cursor as string;

    const response = await getOrderDetailByuserIdServices(userId, cursor);

    if (!userId) {
      return ErrorResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        "Invalid request parameters",
      );
    }

    return SuccessResponse(res, STATUS_CODE.OK, response);
  } catch (error) {
    next(error);
  }
};

//-------------------------------------------------------------------------------------------------------------------------------------

const getOrderDetailWithOrderIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const orderId = req.query.orderId as string;

    if (!orderId) {
      return ErrorResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        "Invalid request parameters",
      );
    }

    const response = await getOrderDetailWithOrderIdServices(orderId);

    if ((response as { status: number }).status === STATUS_CODE.NOT_FOUND) {
      return ErrorResponse(
        res,
        (response as { status: number }).status,
        (response as { message: string }).message,
      );
    }
    return SuccessResponse(res, STATUS_CODE.OK, response);
  } catch (error) {
    next(error);
  }
};

//------------------------------------------------------------------------------------------------------------------------

const userRatingProductsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id, rating, review } = req.body;

    if (!id || typeof id !== "string") {
      return ErrorResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        "Product id is required and must be a string",
      );
    }

    if (
      rating === undefined ||
      typeof rating !== "number" ||
      rating < 1 ||
      rating > 5
    ) {
      return ErrorResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        "Rating must be a number between 1 and 5",
      );
    }

    if (!review || typeof review !== "string" || review.trim().length < 3) {
      return ErrorResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        "Review must be at least 3 characters long",
      );
    }

    const response = await userRatingProductsServices(id, rating, review);

    if ((response as { status: number }).status === STATUS_CODE.NOT_FOUND) {
      return ErrorResponse(
        res,
        (response as { status: number }).status,
        (response as { message: string }).message,
      );
    }
    return SuccessResponse(res, STATUS_CODE.OK, response);
  } catch (error) {
    next(error);
  }
};

//-----------------------------------------------------------------------------------------------------------

const shareAppFeedbackController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let { userId, rating, type, feedback } = req.body;

    let images: string[] = [];
    if (
      req.files &&
      (req as any).files.images &&
      Array.isArray((req as any).files.images)
    ) {
      images = (req as any).files.images.map((file: any) => file.key);
    }

    const finalData: IFeedback = {
      userId,
      rating,
      type,
      feedback,
      images,
    };

    const response = await shareAppFeedbackServices(finalData);

    if ((response as { status: number }).status === STATUS_CODE.BAD_REQUEST) {
      return ErrorResponse(
        res,
        (response as { status: number }).status,
        (response as { message: string }).message,
      );
    }
    return SuccessResponse(res, STATUS_CODE.OK, response);
  } catch (error) {
    next(error);
  }
};

//-------------------------------------------------------------------------------------------------------------------------------------
const getPersonalInformationByUserIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const userId = req.query.userId as string;
    const response = await getPersonalInformationByUserIdServices(userId);

    if ((response as { status: number }).status === STATUS_CODE.NOT_FOUND) {
      return ErrorResponse(
        res,
        (response as { status: number }).status,
        (response as { message: string }).message,
      );
    }
    return SuccessResponse(res, STATUS_CODE.OK, response);
  } catch (error) {
    next(error);
  }
};

//----------------------------------------------------------------------------------------------------------------------------------------

const emptyCartAfterCheckoutController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const userId = req.body.userId as string;

    const response = await emptyCartAfterCheckoutServices(userId);

    if ((response as { status: number }).status === STATUS_CODE.NOT_FOUND) {
      return ErrorResponse(
        res,
        (response as { status: number }).status,
        (response as { message: string }).message,
      );
    }
    return SuccessResponse(res, STATUS_CODE.OK, response);
  } catch (error) {
    next(error);
  }
};

//----------------------------------------------------
export {
  getProductsBycategoryIdController,
  getAllChildCategoriesController,
  getProductByChildCategoryIdController,
  syncCartController,
  getCartByUserIdController,
  incAndDecCartQuantityController,
  getHomePageBannerAndProductController,
  getParentcatandTagDataController,
  getTrendSectionDataForHomePageController,
  getRandomProductsForCartPageController,
  searchProductController,
  getOrderDetailByuserIdController,
  getProductsbyProductIdController,
  getOrderDetailWithOrderIdController,
  userRatingProductsController,
  shareAppFeedbackController,
  getPersonalInformationByUserIdController,
  emptyCartAfterCheckoutController,
};

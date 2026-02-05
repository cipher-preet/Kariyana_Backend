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
} from "../Services/Productapp.services";

import { generateCloudFrontSignedUrl } from "../../utils/cloudfrontSigner";
import { Icart } from "../../types/CartTypes";
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
      images: product.images.map((key: string) =>
        generateCloudFrontSignedUrl(key),
      ),
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
    const cursor = req.query.cursor as string | undefined;
    const response = await getHomePageBannerAndProductServices(limit, cursor);
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
};

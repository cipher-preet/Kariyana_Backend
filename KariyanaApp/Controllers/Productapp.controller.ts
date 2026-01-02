import { ErrorResponse, STATUS_CODE, SuccessResponse } from "../../Api";
import { NextFunction, Request, Response } from "express";
import {
  getProductsBycategoryIdService,
  getAllChildCategoriesServices,
  getProductByChildCategoryIdServices,
} from "../Services/Productapp.services";

import { generateCloudFrontSignedUrl } from "../../utils/cloudfrontSigner";
//----------------------------------------------------------------------------------
const getProductsBycategoryIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const categoryId = req.params.categoryId as string;
    const { cursor } = req.query;

    const limit = Math.min(Number(req.query.limit) || 10, 50);

    const response = await getProductsBycategoryIdService(
      categoryId,
      limit,
      cursor as string | undefined
    );

    const productsWithSignedUrls = response.products.map((product: any) => ({
      ...product,
      images: product.images.map((key: string) =>
        generateCloudFrontSignedUrl(key)
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
  next: NextFunction
): Promise<any> => {
  try {
    const response = await getAllChildCategoriesServices();

    if ((response as { status: number }).status === STATUS_CODE.NOT_FOUND) {
      return ErrorResponse(
        res,
        (response as { status: number }).status,
        "error while editing child Category"
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
  next: NextFunction
): Promise<any> => {
  try {
    const childCatId = req.params.childCatId as string;

    const { cursor } = req.query;

    const limit = Math.min(Number(req.query.limit) || 10, 50);

    const response: any = await getProductByChildCategoryIdServices(
      childCatId,
      limit,
      cursor as string | undefined
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

//----------------------------------------------------
export {
  getProductsBycategoryIdController,
  getAllChildCategoriesController,
  getProductByChildCategoryIdController,
};

import { ErrorResponse, STATUS_CODE, SuccessResponse } from "../../Api";
import { NextFunction, Request, Response } from "express";
import { getProductsBycategoryIdService } from "../Services/Productapp.services";

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




//----------------------------------------------------
export { getProductsBycategoryIdController };

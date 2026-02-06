import { ErrorResponse, STATUS_CODE, SuccessResponse } from "../../Api";
import { NextFunction, Request, Response } from "express";
import {
  getUserProfileForCardsInDashboardServices,
  getUserAdditionalProfileDetailServices,
  approveShopServices,
  getPendingApprovalProfileCardsInDashboardServices,
} from "../Services/UserInfo.services";
import { generateCloudFrontSignedUrl } from "../../utils/cloudfrontSigner";

//-----------------------------------------------------------------------------------------------

const getUserProfileForCardsInDashboardController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const limit = Number(req.query.limit) || 4;
    const cursor = req?.query?.cursor;

    const response = await getUserProfileForCardsInDashboardServices(
      limit,
      cursor as string | undefined,
    );

    const userWithSignedUrl = response.userData.map((user: any) => {
      const { documents, ...rest } = user;
      return {
        ...rest,
        image: documents?.shopPhotos
          ? generateCloudFrontSignedUrl(documents.shopPhotos)
          : null,
      };
    });

    SuccessResponse(res, STATUS_CODE.OK, {
      users: userWithSignedUrl,
      nextCursor: response.nextCursor,
      hasNextPage: response.hasNextPage,
    });
  } catch (error) {
    next(error);
  }
};

//--------------------------------------------------------------------------------------------------

const getUserAdditionalProfileDetailController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const shopId = req?.query?._id;

    const response = await getUserAdditionalProfileDetailServices(
      shopId as string,
    );

    if ((response as { status: number }).status === STATUS_CODE.NOT_FOUND) {
      return ErrorResponse(
        res,
        (response as { status: number }).status,
        response.message,
      );
    }

    SuccessResponse(res, STATUS_CODE.OK, response);
  } catch (error) {
    next(error);
  }
};
//---------------------------------------------------------------------------------------------------

const approveShopController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { shopId } = req.body;

    const response = await approveShopServices(shopId as string);

    if ((response as { status: number }).status === STATUS_CODE.NOT_FOUND) {
      return ErrorResponse(
        res,
        (response as { status: number }).status,
        response.message,
      );
    }

    SuccessResponse(res, STATUS_CODE.OK, response);
  } catch (error) {
    next(error);
  }
};

//---------------------------------------------------------------------------------------------------

const getPendingApprovalProfileCardsInDashboardController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const limit = Number(req.query.limit) || 10;
    const cursor = req.query.cursor;

    const response = await getPendingApprovalProfileCardsInDashboardServices(
      limit,
      cursor as string | undefined,
    );

    const userWithSignedUrl = response.userData.map((user: any) => {
      const { documents, ...rest } = user;
      return {
        ...rest,
        image: documents?.shopPhotos
          ? generateCloudFrontSignedUrl(documents.shopPhotos)
          : null,
      };
    });

    SuccessResponse(res, STATUS_CODE.OK, {
      users: userWithSignedUrl,
      nextCursor: response.nextCursor,
      hasNextPage: response.hasNextPage,
    });
  } catch (error) {
    next(error);
  }
};

//---------------------------------------------------------------------------------------------------

export {
  getUserProfileForCardsInDashboardController,
  getUserAdditionalProfileDetailController,
  approveShopController,
  getPendingApprovalProfileCardsInDashboardController,
};

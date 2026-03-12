import { ErrorResponse, STATUS_CODE, SuccessResponse } from "../../Api";
import { NextFunction, Request, Response } from "express";
import {
  createTrendsServices,
  getProductsForTrendBuildingServices,
  getTrendsForDashboardServices,
  deleteTrendsFromDashboardServices,
} from "../Services/TrendManagement.services";
import { ItrendData } from "../../types/TrendType";

const createTrendsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { trendName, trendDescription, productId } = req.body;

    const finalData: ItrendData = {
      trendName,
      trendDescription,
      productId,
    };

    const response = await createTrendsServices(finalData);

    if (response.status === STATUS_CODE.BAD_REQUEST) {
      return ErrorResponse(res, response.status, response.message);
    }

    if (response.status === STATUS_CODE.NOT_FOUND) {
      return ErrorResponse(res, response.status, response.message);
    }

    SuccessResponse(res, response.status, response.message);
  } catch (error) {
    next(error);
  }
};

//----------------------------------------------------------------------------------------

const getProductsForTrendBuildingController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { cursor, limit = 10, search = "" } = req.query;
    const cursorcomming = cursor as string;
    const limitNumber = parseInt(limit as string, 10);
    const searchString = search as string;

    const response = await getProductsForTrendBuildingServices(
      cursorcomming,
      limitNumber,
      searchString,
    );

    SuccessResponse(res, STATUS_CODE.OK, {
      products: response.data,
      nextCursor: response.nextCursor,
      hasNextPage: response.hasNextPage,
    });
  } catch (error) {
    next(error);
  }
};

//-----------------------------------------------------------------------------------------

const getTrendsForDashboardController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const response = await getTrendsForDashboardServices();
    SuccessResponse(res, STATUS_CODE.OK, response);
  } catch (error) {
    next(error);
  }
};

//-----------------------------------------------------------------------------------------

const deleteTrendsFromDashboardController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { trendId } = req.body;

    if (!trendId) {
      return ErrorResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        "Trend ID is required",
      );
    }

    const response = await deleteTrendsFromDashboardServices(trendId);
    if (response.status === STATUS_CODE.NOT_FOUND) {
      return ErrorResponse(res, response.status, response.message);
    }
    SuccessResponse(res, response.status, response.message);
  } catch (error) {
    next(error);
  }
};

//-----------------------------------------------------------------------------------------

const editTrendsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    
    const { trendId, productId } = req.body;

    // const response = await 

  } catch (error) {
    next(error);
  }
}

export {
  createTrendsController,
  getProductsForTrendBuildingController,
  getTrendsForDashboardController,
  deleteTrendsFromDashboardController,
  editTrendsController
};

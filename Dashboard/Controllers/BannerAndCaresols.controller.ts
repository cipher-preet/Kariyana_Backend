import { ErrorResponse, STATUS_CODE, SuccessResponse } from "../../Api";
import { NextFunction, Request, Response } from "express";
import { getBannerAndCarsolsForDashboardServices } from "../Services/BannerAndCaresols.service";

const getBannerAndCarsolsForDashboardController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const response = await getBannerAndCarsolsForDashboardServices();
    return SuccessResponse(res, STATUS_CODE.OK, response);
  } catch (error) {
    next(error);
  }
};

//-------------------------------------------------------------------------------------------

export { getBannerAndCarsolsForDashboardController };

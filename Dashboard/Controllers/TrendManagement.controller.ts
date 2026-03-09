import { ErrorResponse, STATUS_CODE, SuccessResponse } from "../../Api";
import { NextFunction, Request, Response } from "express";

const createTrendsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {

    // const response = await createTrendsServices();

  } catch (error) {
    next(error);
  }
};


//----------------------------------------------------------------------------------------

export {
    createTrendsController
}
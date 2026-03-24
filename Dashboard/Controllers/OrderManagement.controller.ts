import { ErrorResponse, STATUS_CODE, SuccessResponse } from "../../Api";
import { NextFunction, Request, Response } from "express";
import {
  getUpcomingOrderDetailsforDashboardServices,
  updateOrderStatusInOrderPageServices,
} from "../Services/OrderManagement.services";

const getUpcomingOrderDetailsforDashboardController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const response = await getUpcomingOrderDetailsforDashboardServices();

    SuccessResponse(res, STATUS_CODE.OK, response);
  } catch (error) {
    next(error);
  }
};

//---------------------------------------------------------------------------------------------------

const updateOrderStatusInOrderPageController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { id, status } = req.body;

    const response = await updateOrderStatusInOrderPageServices(id, status);

    if (response.status === STATUS_CODE.NOT_FOUND) {
      return ErrorResponse(res, response.status, response.message);
    }

    return SuccessResponse(res, response.status, response.message);
  } catch (error) {
    next(error);
  }
};

//--------------------------------------------------------

export {
  getUpcomingOrderDetailsforDashboardController,
  updateOrderStatusInOrderPageController,
};

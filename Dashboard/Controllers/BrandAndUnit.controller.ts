import { ErrorResponse, STATUS_CODE, SuccessResponse } from "../../Api";
import { NextFunction, Request, Response } from "express";

import {
  addBrandServices,
  addUnitServices,
  editBrandServices,
  editUnitServices,
  getBrandsForFormsServices,
  getUnitServices,
  getUnitFordashboardServices
} from "../Services/BrandAndUnit.services";
import { IUnitInterface } from "../../types/Dashboardtypes";
//----------------------------------------------------------------------------------

const addBrandController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return ErrorResponse(res, STATUS_CODE.NOT_FOUND, "please provide name");
    }

    const response = await addBrandServices(name, description);

    if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
      return ErrorResponse(res, response.status, response.message);
    }

    SuccessResponse(res, response.status, response.message);
  } catch (error) {
    next(error);
  }
};

//------------------------------------------------------------------------------------------------

const addUnitController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { name, shortName, baseUnit, multiplier } = req.body;

    if (!name || !shortName) {
      return ErrorResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        "please provide name or shortName"
      );
    }

    const data: IUnitInterface = {
      name,
      shortName,
      baseUnit,
      multiplier,
    };

    const response = await addUnitServices(data);
    if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
      return ErrorResponse(res, response.status, response.message);
    }

    SuccessResponse(res, response.status, response.message);
  } catch (error) {
    next(error);
  }
};

//----------------------------------------------------------------------------------------

const editBrandController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { _id, name, description } = req.body;

    const response = await editBrandServices(_id, name, description);

    if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
      return ErrorResponse(res, response.status, response.message);
    }

    SuccessResponse(res, response.status, response.message);
  } catch (error) {
    next(error);
  }
};

//----------------------------------------------------------------------------------------
const editUnitController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { _id, name, shortName, baseUnit, multiplier } = req.body;

    const data: IUnitInterface = {
      _id,
      name,
      shortName,
      baseUnit,
      multiplier,
    };

    const response = await editUnitServices(data);

    if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
      return ErrorResponse(res, response.status, response.message);
    }

    SuccessResponse(res, response.status, response.message);
  } catch (error) {
    next(error);
  }
};
//-------------------------------------------------------------------------------------------

const getBrandsForFormsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const response = await getBrandsForFormsServices();
    return SuccessResponse(res, STATUS_CODE.OK, response);
  } catch (error) {
    next(error);
  }
};
//-------------------------------------------------------------------------------------------

const getUnitController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const response = await getUnitServices();
    return SuccessResponse(res, STATUS_CODE.OK, response);
  } catch (error) {
    next(error);
  }
};

//-----------------------------------------------------------------------------------------

const getUnitFordashboardController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const response = await getUnitFordashboardServices();
    return SuccessResponse(res, STATUS_CODE.OK, response);
  } catch (error) {
    next(error);
  }
};

//--------------------------------------------
export {
  addBrandController,
  addUnitController,
  editUnitController,
  editBrandController,
  getBrandsForFormsController,
  getUnitController,
  getUnitFordashboardController,
};

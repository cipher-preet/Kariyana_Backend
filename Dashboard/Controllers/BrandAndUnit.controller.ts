import { ErrorResponse, STATUS_CODE, SuccessResponse } from "../../Api";
import { NextFunction, Request, Response } from "express";

import {
  addBrandServices,
  addUnitServices,
  editBrandServices,
  editUnitServices,
  getBrandsForFormsServices,
  getUnitServices,
  getUnitFordashboardServices,
  getBrandFordashboardServices,
  addTagsServices,
  getTagsServices,
  editTagServices,
  getuserCartDataForDashboardServices,
  contactUsPageForWebsiteServices,
  getContactUsPageDetailsFromWebsiteServices,
  markAsReadInContactUsServices,
} from "../Services/BrandAndUnit.services";
import { IcontactusType, IUnitInterface } from "../../types/Dashboardtypes";
//----------------------------------------------------------------------------------

const addBrandController = async (
  req: Request,
  res: Response,
  next: NextFunction,
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
  next: NextFunction,
): Promise<any> => {
  try {
    const { name, shortName, baseUnit, multiplier } = req.body;

    if (!name || !shortName) {
      return ErrorResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        "please provide name or shortName",
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
  next: NextFunction,
): Promise<any> => {
  try {
    const { _id, name, description } = req.body;

    const response = await editBrandServices(_id, name, description);

    if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
      return ErrorResponse(res, response.status, response.message);
    }

    SuccessResponse(res, response.status, response.message);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//----------------------------------------------------------------------------------------
const editUnitController = async (
  req: Request,
  res: Response,
  next: NextFunction,
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
  next: NextFunction,
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
  next: NextFunction,
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
  next: NextFunction,
): Promise<any> => {
  try {
    const response = await getUnitFordashboardServices();
    return SuccessResponse(res, STATUS_CODE.OK, response);
  } catch (error) {
    next(error);
  }
};

//--------------------------------------------------------------------------------------

const getBrandFordashboardController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const response = await getBrandFordashboardServices();
    return SuccessResponse(res, STATUS_CODE.OK, response);
  } catch (error) {
    next(error);
  }
};

//--------------------------------------------------------------------------------------

const addTagsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { name } = req.body;

    if (!name) {
      return ErrorResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        "please provide name as well !",
      );
    }

    const response = await addTagsServices(name);

    if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
      return ErrorResponse(res, response.status, response.message);
    }

    return SuccessResponse(res, STATUS_CODE.OK, response);
  } catch (error) {
    next(error);
  }
};

//------------------------------------------------------------------------------------------

const getTagsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const response = await getTagsServices();
    return SuccessResponse(res, STATUS_CODE.OK, response);
  } catch (error) {
    next(error);
  }
};

//-----------------------------------------------------------------------------------------

const editTagController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { _id, name, isActive } = req.body;
    const response = await editTagServices(_id, name, isActive);
    if (response.status === STATUS_CODE.BAD_REQUEST) {
      return ErrorResponse(res, response.status, response.message);
    }
    return SuccessResponse(res, response.status, response.message);
  } catch (error) {
    next(error);
  }
};

//-------------------------------------------------------------------------------------------

const getuserCartDataForDashboardController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.query.userId as string;
    const response = await getuserCartDataForDashboardServices(userId);
  } catch (error) {
    next(error);
  }
};

//--------------------------------------------------------------------------------------------

const contactUsPageForWebsiteController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, address, phone, query, message } = req.body;

    const errors: string[] = [];

    if (!name?.trim()) errors.push("name is required.");
    if (!phone) errors.push("Phone number is required.");
    if (!message?.trim()) errors.push("Message cannot be empty.");

    if (errors.length > 0) {
      return ErrorResponse(res, STATUS_CODE.BAD_REQUEST, errors.join(" "));
    }

    const finalData: IcontactusType = {
      name,
      address,
      phone,
      query,
      message,
    };

    const response = await contactUsPageForWebsiteServices(finalData);

    if (response.status === STATUS_CODE.BAD_REQUEST) {
      return ErrorResponse(res, response.status, response.message);
    }
    return SuccessResponse(res, response.status, response.message);
  } catch (error) {
    next(error);
  }
};

//--------------------------------------------------------------------------------------------------

const getContactUsPageDetailsFromWebsiteController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const response = await getContactUsPageDetailsFromWebsiteServices();
    return SuccessResponse(res, STATUS_CODE.OK, response);
  } catch (error) {
    next(error);
  }
};

//--------------------------------------------------------------------------------------------------

const markAsReadInContactUsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { queryId } = req.body;

    const response = await markAsReadInContactUsServices(queryId);

    if (response.status === STATUS_CODE.NOT_FOUND) {
      return ErrorResponse(res, response.status, response.message);
    }
    return SuccessResponse(res, response.status, response.message);
  } catch (error) {
    next(error);
  }
};

//--------------------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------------

export {
  addBrandController,
  addUnitController,
  editUnitController,
  editBrandController,
  getBrandsForFormsController,
  getUnitController,
  getUnitFordashboardController,
  getBrandFordashboardController,
  addTagsController,
  getTagsController,
  editTagController,
  getuserCartDataForDashboardController,
  contactUsPageForWebsiteController,
  getContactUsPageDetailsFromWebsiteController,
  markAsReadInContactUsController
};

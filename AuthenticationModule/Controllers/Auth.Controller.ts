import { ErrorResponse, STATUS_CODE, SuccessResponse } from "../../Api";
import { NextFunction, Request, Response } from "express";

import {
  verifyOtpServices,
  sendOtpServices,
  registerUserServices,
} from "../Services/Auth.services";
import { RegisterInput } from "../../types/Dashboardtypes";
import { User } from "../Modals/User.Modals";

//-----------------------------------------------------------------------------------------------------
const verifyOtpController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return ErrorResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        "Please provide both phone and OTP",
      );
    }

    const response = await verifyOtpServices(Number(phone), Number(otp));

    if (!response.success) {
      return ErrorResponse(res, response.status, response.message);
    }

    req.session.user = {
      _id: response.user.id,
      phone: response.user.phone,
      role: response.user.role,
      status: response.user.status,
    };

    await new Promise<void>((resolve, reject) => {
      req.session.save((err) => {
        if (err) reject(err);
        resolve();
      });
    });

    return SuccessResponse(res, STATUS_CODE.OK, {
      nextScreen: response.user.status,
      userId: response.user.id,
      role: response.user.role,
      status: response.user.status,
      isActive: response.user.isActive,
    });
  } catch (error) {
    next(error);
  }
};

//---------------------------------------------------------------------------------------------------

const sendOtpController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return ErrorResponse(res, STATUS_CODE.BAD_REQUEST, "Phone is required");
    }

    const response = await sendOtpServices(Number(phone));

    if ((response as { status: number }).status !== STATUS_CODE.OK) {
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

//---------------------------------------------------------------------------------------------------

const registerUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const phone = req?.session?.user?.phone;

    console.log(req.session);

    const {
      name,
      dateofbirth,
      address,
      shopName,
      Type,
      gstNumber,
      tenureOfShop,
      Dsale,
      Msales,
    } = req.body;

    const files = req.files as {
      shopPhotos?: Express.MulterS3.File[];
    };

    const documents = {
      shopPhotos: files?.shopPhotos?.[0]?.key || null,
    };

    const data: RegisterInput = {
      phone,
      name,
      dateofbirth,
      address,
      shopName,
      Type,
      gstNumber,
      tenureOfShop,
      Dsale,
      Msales,
      documents,
    };

    const response = await registerUserServices(data);

    if ((response as { status: number }).status === STATUS_CODE.UNAUTHORIZED) {
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

//-------------------------------------------------------------------------
const loginUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return ErrorResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        "Please provide both phone and OTP",
      );
    }

    const response = await verifyOtpServices(Number(phone), Number(otp));

    if (!response.success) {
      return ErrorResponse(res, response.status, response.message);
    }

    req.session.user = {
      _id: response.user.id,
      phone: response.user.phone,
      role: response.user.role,
      status: response.user.status,
    };

    await new Promise<void>((resolve, reject) => {
      req.session.save((err) => {
        if (err) reject(err);
        resolve();
      });
    });

    return SuccessResponse(res, 200, {
      nextScreen: response.user.status,
      userId: response.user.id,
      role: response.user.role,
      status: response.user.status,
      isActive: response.user.isActive,
    });
  } catch (error) {
    next(error);
  }
};

//---------------------------------------------------------------------------------------------------------------

const verifyMeController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    if (!req.session.user) {
      return ErrorResponse(
        res,
        STATUS_CODE.UNAUTHORIZED,
        "authentication token missing",
      );
    }

    const user = await User.findById(req.session.user._id);

    if (!user) {
      req.session.destroy(() => {});
      return res.status(401).json({ authenticated: false });
    }
    const response = {
      userId: user._id,
      role: user.role,
      status: user.status,
    };

    SuccessResponse(res, STATUS_CODE.OK, response);
  } catch (error) {
    next(error);
  }
};

export {
  verifyOtpController,
  sendOtpController,
  registerUserController,
  loginUserController,
  verifyMeController,
};

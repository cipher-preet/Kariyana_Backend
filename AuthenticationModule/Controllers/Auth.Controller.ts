import { ErrorResponse, STATUS_CODE, SuccessResponse } from "../../Api";
import { NextFunction, Request, Response } from "express";

import {
  verifyOtpServices,
  sendOtpServices,
  registerUserServices,
} from "../Services/Auth.services";
import { RegisterInput } from "../../types/Dashboardtypes";
import { User } from "../Modals/User.Modals";
import { AuthRequest } from "../../Config/FirebaseAuthebtication/auth.middleware";

//-----------------------------------------------------------------------------------------------------
// const verifyOtpController = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     const { phone, otp } = req.body;

//     if (!phone && !otp) {
//       return ErrorResponse(
//         res,
//         STATUS_CODE.NOT_FOUND,
//         "Please provide both PhoneNumber and Otp for Login",
//       );
//     }

//     const response = await verifyOtpServices(phone, otp);

//     if (!response.success) {
//       return ErrorResponse(res, response.status, response.message);
//     }

//     req.session.regenerate((err) => {
//       if (err) {
//         return ErrorResponse(
//           res,
//           STATUS_CODE.INTERNAL_SERVER_ERROR,
//           "Session creation failed",
//         );
//       }

//       req.session.userId = response.user.id;
//       req.session.role = response.user.role;

//       return SuccessResponse(res, STATUS_CODE.OK, {
//         userId: response.user.id,
//         role: response.user.role,
//       });
//     });
//   } catch (error) {
//     next(error);
//   }
// };

//---------------------------------------------------------------------------------------------------

const sendOtpController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { phone } = req.body;

    const response = await sendOtpServices(phone);

    if ((response as { status: number }).status === STATUS_CODE.NOT_FOUND) {
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
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    if (!req.user) {
      return ErrorResponse(res, 401, "Unauthorized");
    }

    const { uid, phone_number } = req.user;
    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      user = await User.create({
        firebaseUid: uid,
        phone: phone_number,
        status: "REGISTER",
        isActive: true,
      });
    }

    if (!user.isActive) {
      return ErrorResponse(res, 403, "Account disabled");
    }

    req.session.user = {
      _id: user._id.toString(),
      firebaseUid: user.firebaseUid,
      phone: user.phone,
      role: user.role,
      status: user.status,
    };

    await new Promise<void>((resolve, reject) => {
      req.session.save((err) => {
        if (err) reject(err);
        resolve();
      });
    });

    return SuccessResponse(res, 200, {
      nextScreen: user.status,
      userId: user._id,
      role: user.role,
      status: user.status,
      isActive: user.isActive,
    });
  } catch (error) {
    next(error);
  }
};

//---------------------------------------------------------------------------------------------------------------

const verifyMeController = async (
  req: AuthRequest,
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
  // verifyOtpController,
  sendOtpController,
  registerUserController,
  loginUserController,
  verifyMeController,
};

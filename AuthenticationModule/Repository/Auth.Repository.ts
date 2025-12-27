import { STATUS_CODE } from "../../Api";
import { RegisterInput, VerifyOtpResult } from "../../types/Dashboardtypes";
import { Otp } from "../Modals/Otp.modal";
import { ShopProfileModel } from "../Modals/ShopProfile.modal";
import { User } from "../Modals/User.Modals";
import crypto from "crypto";

//------------------------------------------------------------------------------------------------------------------

export const verifyOtpRepository = async (
  phone: number,
  otp: number
): Promise<VerifyOtpResult> => {
  try {
    const user = await User.findOne({ phone });

    if (!user) {
      return {
        success: false,
        status: STATUS_CODE.NOT_FOUND,
        message: "User not found",
      };
    }

    const record = await Otp.findOne({ userId: user._id });

    if (!record) {
      return {
        success: false,
        status: STATUS_CODE.NOT_FOUND,
        message: "OTP expired",
      };
    }

    if (record.otpHash !== otp) {
      record.attempts += 1;
      await record.save();
      return {
        success: false,
        status: STATUS_CODE.UNAUTHORIZED,
        message: "Invalid OTP",
      };
    }

    await record.deleteOne();

    return {
      success: true,
      status: STATUS_CODE.OK,
      message: "Login successful",
      user: {
        id: user._id.toString(),
        role: user.role,
        phone: user.phone,
      },
    };
  } catch (error) {
    console.log("error in auth repository ", error);
    throw error;
  }
};

//-----------------------------------------------------------------------------------

export const sendOtpRepository = async (phone: number) => {
  try {
    const user = await User.findOne({ phone });

    if (!user) {
      return {
        status: STATUS_CODE.NOT_FOUND,
        message: "User not found",
      };
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    await Otp.deleteMany({ userId: user._id });

    await Otp.create({
      userId: user._id,
      otpHash: otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      attempts: 0,
    });

    return {
      status: STATUS_CODE.OK,
      message: "OTP sent successfully",
    };
  } catch (error) {
    console.log("error in auth repository ", error);
    throw error;
  }
};

//------------------------------------------------------------------------------------------

export const registerUserRepository = async (data: RegisterInput) => {
  try {
    const existingUser = await User.findOne({ phone: data.phone });

    if (existingUser) {
      return {
        status: STATUS_CODE.UNAUTHORIZED,
        message: "User is already registered",
      };
    }

    const user = await User.create({
      phone: data.phone,
      role: "BUYER",
    });

    await ShopProfileModel.create({
      userId: user._id,
      shopName: data.shopName,
      ownerName: data.ownerName,
      address: data.address,
      gstNumber: data.gstNumber,
      documents: data.documents,
    });

    return {
      status: STATUS_CODE.OK,
      message: "Registration Submitted. Awaiting approval",
    };
  } catch (error) {
    console.log("error in auth repository ", error);
    throw error;
  }
};

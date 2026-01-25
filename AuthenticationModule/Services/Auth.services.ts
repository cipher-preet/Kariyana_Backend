import { RegisterInput } from "../../types/Dashboardtypes";
import {
  verifyOtpRepository,
  sendOtpRepository,
  registerUserRepository,
} from "../Repository/Auth.Repository";

//-----------------------------------------------------------------------------------------------------------

export const verifyOtpServices = async (phone: number, otp: number) => {
  try {
    const response = await verifyOtpRepository(phone, otp);
    return response;
  } catch (error) {
    console.log("this is authservice error", error);
    throw error;
  }
};

//---------------------------------------------------------------------------------------------------------------

export const sendOtpServices = async (phone: number) => {
  try {
    const response = await sendOtpRepository(phone);
    return response;
  } catch (error) {
    console.log("this is authservice error", error);
    throw error;
  }
};

//---------------------------------------------------------------------------------------------------------------

export const registerUserServices = async (data: RegisterInput) => {
  try {
    const response = registerUserRepository(data);
    return response;
  } catch (error) {
    console.log("this is authservice error", error);
    throw error;
  }
};

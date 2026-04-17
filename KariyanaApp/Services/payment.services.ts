import { IAddressSchema, IOrderData } from "../../types/OrderTypes";
import {
  createOrderRepository,
  addDeliveryAddressRepository,
  getUserDileveryAddressRepository,
  getOrderStatusRepository,
  updateDeliveryAddressRepository,
  deleteDeliveryAddressRepository,
} from "../Repository/payment.repository";

export const createOrderServices = async (finalData: IOrderData) => {
  try {
    const response = await createOrderRepository(finalData);
    return response;
  } catch (error) {
    console.log("error in payment services", error);
    throw error;
  }
};

//------------------------------------------------------------------------------------------------

export const addDeliveryAddressServices = async (finalData: IAddressSchema) => {
  try {
    const response = await addDeliveryAddressRepository(finalData);
    return response;
  } catch (error) {
    console.log("error in payment services", error);
    throw error;
  }
};

//-----------------------------------------------------------------------------------------------

export const getUserDileveryAddressServices = async (userId: string) => {
  try {
    const response = await getUserDileveryAddressRepository(userId);
    return response;
  } catch (error) {
    console.log("error in payment services", error);
    throw error;
  }
};

//-----------------------------------------------------------------------------------------------

export const getOrderStatusServices = async (orderId: string) => {
  try {
    const response = await getOrderStatusRepository(orderId);
    return response;
  } catch (error) {
    console.log("error in payment services", error);
    throw error;
  }
};

//----------------------------------------------------------------------------------------------

export const updateDeliveryAddressServices = async (
  finalData: IAddressSchema,
) => {
  try {
    const response = await updateDeliveryAddressRepository(finalData);
    return response;
  } catch (error) {
    console.log("error in payment services", error);
    throw error;
  }
};

//----------------------------------------------------------------------------------------------------

export const deleteDeliveryAddressServices = async (id: string) => {
  try {
    const response = await deleteDeliveryAddressRepository(id);
    return response;
  } catch (error) {
    console.log("error in payment services", error);
    throw error;
  }
};

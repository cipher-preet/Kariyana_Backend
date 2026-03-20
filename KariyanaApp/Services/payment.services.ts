import { IOrderData } from "../../types/OrderTypes";
import { createOrderRepository } from "../Repository/payment.repository";

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


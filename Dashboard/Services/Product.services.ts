import { IProduct } from "../../types/Dashboardtypes";
import { addNewProductRepository, editProductRepository } from "../Repository/Product.repository"

export const addNewProductServices = async (finalData:IProduct) => {
  try {
    const response = await addNewProductRepository(finalData);
    return response;
  } catch (error) {
    console.log("error in product services layer", error);
    throw error;
  }
};

//---------------------------------------------------------------------

export const editProductServices = async (finalData:IProduct,productId:string) => {
  try {
    const response = await editProductRepository(finalData,productId);
    return response;
  } catch (error) {
    console.log("error in product services layer", error);
    throw error;
  }
}
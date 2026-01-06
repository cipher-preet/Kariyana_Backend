import { Icart } from "../../types/CartTypes";
import {
  getProductsBycategoryIdRepository,
  getAllChildCategoriesRepository,
  getProductByChildCategoryIdRepository,
  syncCartRepository,
  getCartByUserIdRepository,
  incAndDecCartQuantityRepository,
} from "../Repository/Productapp.repository";

//-----------------------------------------------------------------------------

export const getProductsBycategoryIdService = async (
  categoryId: string,
  limit: number,
  cursor?: string
) => {
  try {
    const response = await getProductsBycategoryIdRepository(categoryId, {
      limit,
      cursor,
    });
    return response;
  } catch (error) {
    console.log("error in product app services", error);
    throw error;
  }
};

//--------------------------------------------------------------------------------
export const getAllChildCategoriesServices = async () => {
  try {
    const response = await getAllChildCategoriesRepository();
    return response;
  } catch (error) {
    console.log("error in product app services", error);
    throw error;
  }
};

//------------------------------------------------------------------------------
export const getProductByChildCategoryIdServices = async (
  childCatId: string,
  limit: number,
  cursor?: string
) => {
  try {
    const response = await getProductByChildCategoryIdRepository(childCatId, {
      limit,
      cursor,
    });
    return response;
  } catch (error) {
    console.log("error in product app services", error);
    throw error;
  }
};

//------------------------------------------------------------------------------------

export const syncCartService = async (FinalData: Icart) => {
  try {
    const response = await syncCartRepository(FinalData);
    return response;
  } catch (error) {
    console.log("error in product app services", error);
    throw error;
  }
};

//------------------------------------------------------------------------------------

export const getCartByUserIdService = async (userId: string) => {
  try {
    const response = await getCartByUserIdRepository(userId);
    return response;
  } catch (error) {
    console.log("error in product app services", error);
    throw error;
  }
};

//------------------------------------------------------------------------------------

export const incAndDecCartQuantityServices = async (
  userId: string,
  productId: string,
  delta: number
) => {
  try {
    const response = await incAndDecCartQuantityRepository(
      userId,
      productId,
      delta
    );
    return response;
  } catch (error) {
    console.log("error in product app services", error);
    throw error;
  }
};

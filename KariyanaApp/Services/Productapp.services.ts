import { Icart } from "../../types/CartTypes";
import { IFeedback } from "../../types/Dashboardtypes";
import { SearchQuery } from "../../types/Search";
import {
  getProductsBycategoryIdRepository,
  getAllChildCategoriesRepository,
  getProductByChildCategoryIdRepository,
  syncCartRepository,
  getCartByUserIdRepository,
  incAndDecCartQuantityRepository,
  getHomePageBannerAndProductRepository,
  getParentcatandTagDataRepository,
  getTrendSectionDataForHomePageRepository,
  getRandomProductsForCartPageRepository,
  searchProductRepository,
  getOrderDetailByuserIdRepository,
  getProductsbyProductIdRepository,
  getOrderDetailWithOrderIdRepository,
  userRatingProductsServicesRepository,
  shareAppFeedbackRepository,
  getPersonalInformationByUserIdRepository,
} from "../Repository/Productapp.repository";

//-----------------------------------------------------------------------------

export const getProductsBycategoryIdService = async (
  categoryId: string,
  limit: number,
  cursor?: string,
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

//-------------------------------------------------------------------------------

export const getProductsbyProductIdService = async (productId: string) => {
  try {
    const response = await getProductsbyProductIdRepository(productId);
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
  cursor?: string,
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
  delta: number,
) => {
  try {
    const response = await incAndDecCartQuantityRepository(
      userId,
      productId,
      delta,
    );
    return response;
  } catch (error) {
    console.log("error in product app services", error);
    throw error;
  }
};

//--------------------------------------------------------------------------------------------

export const getHomePageBannerAndProductServices = async (
  limit: number,
  cursor?: string | null,
) => {
  try {
    const response = await getHomePageBannerAndProductRepository(limit, cursor);
    return response;
  } catch (error) {
    console.log("error in product app services", error);
    throw error;
  }
};

//-----------------------------------------------------------------------------------------------------------

export const getParentcatandTagDataServices = async () => {
  try {
    const response = await getParentcatandTagDataRepository();
    return response;
  } catch (error) {
    console.log("error in product app services", error);
    throw error;
  }
};

//--------------------------------------------------------------------------------------------------------

export const getTrendSectionDataForHomePageServices = async (
  limit: number,
  cursor?: string,
) => {
  try {
    const response = await getTrendSectionDataForHomePageRepository(
      limit,
      cursor,
    );
    return response;
  } catch (error) {
    console.log("error in product app services", error);
    throw error;
  }
};

//----------------------------------------------------------------------------------------------------------

export const getRandomProductsForCartPageServices = async () => {
  try {
    const response = await getRandomProductsForCartPageRepository();
    return response;
  } catch (error) {
    console.log("error in product app services", error);
    throw error;
  }
};

//----------------------------------------------------------------------------------------------------------

export const searchProductService = async (query: SearchQuery) => {
  try {
    const response = await searchProductRepository(query);
    return response;
  } catch (error) {
    console.log("error in search services", error);
    throw error;
  }
};

//----------------------------------------------------------------------------------------------------------

export const getOrderDetailByuserIdServices = async (
  userId: string,
  cursor?: string,
) => {
  try {
    const response = await getOrderDetailByuserIdRepository(userId, cursor);
    return response;
  } catch (error) {
    console.log("error in search services", error);
    throw error;
  }
};

//----------------------------------------------------------------------------------------------------------

export const getOrderDetailWithOrderIdServices = async (orderId: string) => {
  try {
    const response = await getOrderDetailWithOrderIdRepository(orderId);
    return response;
  } catch (error) {
    console.log("error in search services", error);
    throw error;
  }
};

//-------------------------------------------------------------------------------------------------------------

export const userRatingProductsServices = async (
  id: string,
  rating: number,
  review: string,
) => {
  try {
    const response = await userRatingProductsServicesRepository(
      id,
      rating,
      review,
    );
    return response;
  } catch (error) {
    console.log("error in search services", error);
    throw error;
  }
};

//---------------------------------------------------------------------------------------------------------------

export const shareAppFeedbackServices = async (finalData: IFeedback) => {
  try {
    const response = await shareAppFeedbackRepository(finalData);
    return response;
  } catch (error) {
    console.log("error in search services", error);
    throw error;
  }
};


//---------------------------------------------------------------------------------------------------------------------------------

export const getPersonalInformationByUserIdServices = async (userId:string) => {
  try {
    const response = await getPersonalInformationByUserIdRepository(userId);
    return response;
  } catch (error) {
    console.log("error in search services", error);
    throw error;
  }
}
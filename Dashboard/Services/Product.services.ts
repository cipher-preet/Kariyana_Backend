import {
  IProduct,
  IProductHighlightsDetails,
} from "../../types/Dashboardtypes";
import {
  addNewProductRepository,
  editProductRepository,
  getProductsBasicDetailsRepository,
  addProductImagsAndHiglightsRepository,
  getProductImagesAndHighlightsRepository,
  getProductBasicInfoByChildCategoryIdrepository,
  buildHomePageRepository,
  getHomePageDetailsForDashboardRepository,
  addProductCaresolsAndbannersRepository,
} from "../Repository/Product.repository";

export const addNewProductServices = async (finalData: IProduct) => {
  try {
    const response = await addNewProductRepository(finalData);
    return response;
  } catch (error) {
    console.log("error in product services layer", error);
    throw error;
  }
};

//---------------------------------------------------------------------

export const editProductServices = async (
  finalData: IProduct,
  productId: string,
) => {
  try {
    const response = await editProductRepository(finalData, productId);
    return response;
  } catch (error) {
    console.log("error in product services layer", error);
    throw error;
  }
};

//-----------------------------------------------------------------------

export const getProductsBasicDetailsServices = async (
  limit: number,
  cursor?: string,
) => {
  try {
    const response = await getProductsBasicDetailsRepository(limit, cursor);
    return response;
  } catch (error) {
    console.log("error in product services layer", error);
    throw error;
  }
};

//-----------------------------------------------------------------------

export const addProductImagsAndHiglightsServices = async (
  finalData: IProductHighlightsDetails,
) => {
  try {
    const response = await addProductImagsAndHiglightsRepository(finalData);
    return response;
  } catch (error) {
    console.log("error in product services layer", error);
    throw error;
  }
};

//-----------------------------------------------------------------------

export const getProductImagesAndHighlightsServices = async (
  productId: string,
) => {
  try {
    const response = await getProductImagesAndHighlightsRepository(productId);
    return response;
  } catch (error) {
    console.log("error in product services layer", error);
    throw error;
  }
};

//------------------------------------------------------------------------------------------------------------

export const getProductBasicInfoByChildCategoryIdServices = async (
  childCategoryId: string,
) => {
  try {
    const response =
      await getProductBasicInfoByChildCategoryIdrepository(childCategoryId);
    return response;
  } catch (error) {
    console.log("error in product app services", error);
    throw error;
  }
};

//------------------------------------------------------------------------------------------------------------

export const buildHomePageServices = async (homepageDetails: Array<object>) => {
  try {
    const response = await buildHomePageRepository(homepageDetails);
    return response;
  } catch (error) {
    console.log("error in product app services", error);
    throw error;
  }
};

//-----------------------------------------------------------------------------------------------------------------

export const getHomePageDetailsForDashboardServices = async () => {
  try {
    const response = await getHomePageDetailsForDashboardRepository();
    return response;
  } catch (error) {
    console.log("error in getHomePageDetailsForDashboardServices", error);
    throw error;
  }
};

//-----------------------------------------------------------------------------------------------------------------

export const addProductCaresolsAndbannersServices = async (
  banners: Array<string>,
  carosels: Array<string>,
  keepBanners: Array<string>,
  keepCarosels: Array<string>,
) => {
  try {
    const response = await addProductCaresolsAndbannersRepository(
      banners,
      carosels,
      keepBanners,
      keepCarosels,
    );
    return response;
  } catch (error) {
    console.log("error in getHomePageDetailsForDashboardServices", error);
    throw error;
  }
};

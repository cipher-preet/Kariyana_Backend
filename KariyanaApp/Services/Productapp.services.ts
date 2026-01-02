import {
  getProductsBycategoryIdRepository,
  getAllChildCategoriesRepository,
  getProductByChildCategoryIdRepository,
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
  } catch (error) {}
};

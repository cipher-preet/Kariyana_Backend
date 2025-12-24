import { getProductsBycategoryIdRepository } from "../Repository/Productapp.repository";

//-----------------------------------------------------------------------------

export const getProductsBycategoryIdService = async (categoryId:string,limit: number,
  cursor?: string) => {
  try {
    const response = await getProductsBycategoryIdRepository(categoryId,{limit,cursor});
    return response;
  } catch (error) {
    console.log("error in product app services", error);
    throw error;
  }
};

//--------------------------------------------------------------------------------


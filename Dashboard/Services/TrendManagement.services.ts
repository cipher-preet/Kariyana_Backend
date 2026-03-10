import { ItrendData } from "../../types/TrendType";
import {
  createTrendsRepository,
  getProductsForTrendBuildingRepository,
} from "../Repository/TrendManagement.repository";

export const createTrendsServices = async (finalData: ItrendData) => {
  try {
    return await createTrendsRepository(finalData);
  } catch (error) {
    console.log("Error in createTrendsServices", error);
    throw error;
  }
};

//----------------------------------------------------------------------------------------

export const getProductsForTrendBuildingServices = async (
  cursorcomming: string,
  limit: number,
  search: string,
) => {
  try {
    const response = await getProductsForTrendBuildingRepository(
      cursorcomming,
      limit,
      search,
    );
    return response;
  } catch (error) {
    console.log("Error in createTrendsServices", error);
    throw error;
  }
};

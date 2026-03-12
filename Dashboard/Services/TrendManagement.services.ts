import { ItrendData } from "../../types/TrendType";
import {
  createTrendsRepository,
  getProductsForTrendBuildingRepository,
  getTrendsForDashboardRepository,
  deleteTrendsFromDashboardRepository,
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

//-----------------------------------------------------------------------------------------

export const getTrendsForDashboardServices = async () => {
  try {
    const response = await getTrendsForDashboardRepository();
    return response;
  } catch (error) {
    console.log("Error in createTrendsServices", error);
    throw error;
  }
};

//-----------------------------------------------------------------------------------------

export const deleteTrendsFromDashboardServices = async (trendId: string) => {
  try {
    const response = await deleteTrendsFromDashboardRepository(trendId);
    return response;
  } catch (error) {
    console.log("Error in deleteTrendsFromDashboardServices", error);
    throw error;
  }
};

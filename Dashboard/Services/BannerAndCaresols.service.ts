import { getBannerAndCarsolsForDashboardRepository } from "../Repository/BannerAndCaresols.repository";


//-------------------------------------------------------------------------------------------

export const getBannerAndCarsolsForDashboardServices = async () => {
  try {
    const response = await getBannerAndCarsolsForDashboardRepository();
    return response;
  } catch (error) {
    console.log("error in brand and unit section ", error);
    throw error;
  }
};

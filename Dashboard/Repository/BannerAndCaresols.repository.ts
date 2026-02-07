import { generateCloudFrontSignedUrl } from "../../utils/cloudfrontSigner";
import { BannersAndCaroselsModel } from "../Modals/BannersAndCarosels";

export const getBannerAndCarsolsForDashboardRepository = async () => {
  try {
    const response = await BannersAndCaroselsModel.find({})
      .lean()
      .select({ __v: 0 });

    const finalResponse = response.map((item) => {
      return {
        ...item,
        banners: item.banners.map((banner) =>
          generateCloudFrontSignedUrl(banner),
        ),
        carosels: item.carosels.map((carosel) =>
          generateCloudFrontSignedUrl(carosel),
        ),
      };
    });

    return finalResponse ?? [];
  } catch (error) {
    console.log("error in getBannerAndCarsolsForDashboardRepository ", error);
    throw error;
  }
};

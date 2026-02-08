import { generateCloudFrontSignedUrl } from "../../utils/cloudfrontSigner";
import { BannersAndCaroselsModel } from "../Modals/BannersAndCarosels";

export const getBannerAndCarsolsForDashboardRepository = async () => {
  try {
    const response = await BannersAndCaroselsModel.find({})
      .lean()
      .select({ __v: 0 });

    const finalResponse = response.map((item) => ({
      ...item,
      banners: item.banners.map((key) => ({
        key,
        url: generateCloudFrontSignedUrl(key),
      })),
      carosels: item.carosels.map((key) => ({
        key,
        url: generateCloudFrontSignedUrl(key),
      })),
    }));

    return finalResponse ?? [];
  } catch (error) {
    console.log("error in getBannerAndCarsolsForDashboardRepository ", error);
    throw error;
  }
};

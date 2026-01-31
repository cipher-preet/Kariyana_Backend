import {
  getUserProfileForCardsInDashboardrepository,
  getUserAdditionalProfileDetailRepository,
  approveShopRepository,
  getPendingApprovalProfileCardsInDashboardRepository,
} from "../Repository/UserInfo.repository";

//-----------------------------------------------------------------------------------------------------------

export const getUserProfileForCardsInDashboardServices = async (
  limit: number,
  cursor?: string,
) => {
  try {
    const response = await getUserProfileForCardsInDashboardrepository(
      limit,
      cursor,
    );
    return response;
  } catch (error) {
    console.log("this error is inside the user Info services", error);
    throw error;
  }
};

//-----------------------------------------------------------------------------------------------------------

export const getUserAdditionalProfileDetailServices = async (
  shopId: string,
) => {
  try {
    const response = await getUserAdditionalProfileDetailRepository(shopId);
    return response;
  } catch (error) {
    console.log("this error is inside the user Info services", error);
    throw error;
  }
};

//------------------------------------------------------------------------------------------------------------

export const approveShopServices = async (shopId: string) => {
  try {
    const response = await approveShopRepository(shopId);
    return response;
  } catch (error) {
    console.log("this error is inside the user Info services", error);
    throw error;
  }
};

//------------------------------------------------------------------------------------------------------------

export const getPendingApprovalProfileCardsInDashboardServices = async (
  limit: number,
  cursor?: string,
) => {
  try {
    const response = await getPendingApprovalProfileCardsInDashboardRepository(
      limit,
      cursor,
    );
    return response;
  } catch (error) {
    console.log("this error is inside the user Info services", error);
    throw error;
  }
};

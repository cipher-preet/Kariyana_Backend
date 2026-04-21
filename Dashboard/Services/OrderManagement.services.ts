import {
  getGraphsStatsForDashboardRepository,
  getOrderStatsForDashboardRepository,
  getUpcomingOrderDetailsforDashboardrepository,
  updateOrderStatusInOrderPageRepository,
} from "../Repository/OrderManagement.repository";

export const getUpcomingOrderDetailsforDashboardServices = async () => {
  try {
    const response = await getUpcomingOrderDetailsforDashboardrepository();
    return response;
  } catch (error) {
    console.log("error in orderManagement services layer", error);
    throw error;
  }
};

//-----------------------------------------------------------------------------------------------

export const updateOrderStatusInOrderPageServices = async (
  id: string,
  status: string,
) => {
  try {
    const response = await updateOrderStatusInOrderPageRepository(id, status);
    return response;
  } catch (error) {
    console.log("error in orderManagement services layer", error);
    throw error;
  }
};

//------------------------------------------------------------------------------------------------

export const getOrderStatsForDashboardServices = async () => {
  try {
    const response = await getOrderStatsForDashboardRepository();
    return response;
  } catch (error) {
    console.log("error in dashbord stats services layer", error);
    throw error;
  }
};

//------------------------------------------------------------------------------------------------

export const getGraphsStatsForDashboardServices = async () => {
  try {
    const response = await getGraphsStatsForDashboardRepository();
    return response;
  } catch (error) {
    console.log("error in dashbord stats services layer", error);
    throw error;
  }
};

import { Order } from "../../KariyanaApp/Modals/order.model";
import { STATUS_CODE } from "../../Api";

export const getUpcomingOrderDetailsforDashboardrepository = async () => {
  try {
    const orderDetails = await Order.find({
      status: "paid",
      orderStatus: {
        $in: ["Recieved", "packing", "packed", "outForDelivery", "Delivered"],
      },
    }).sort({ createdAt: -1 });

    const finalResult = orderDetails.map((item: any) => {
      const dateObj = new Date(item.createdAt);
      return {
        id: item._id,
        customer: String(item.userId).substring(0, 6),
        type: item.status,
        date: dateObj.toLocaleDateString("en-IN"),
        time: dateObj.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: item.orderStatus,
        total: item.totalAmount,
        items: item.items,
      };
    });
    return finalResult ?? [];
  } catch (error) {
    console.log("error in orderManagement Repository layer", error);
    throw error;
  }
};

//-------------------------------------------------------------------------------------------------------

export const updateOrderStatusInOrderPageRepository = async (
  id: string,
  status: string,
) => {
  try {
    const orderUpdate = await Order.findByIdAndUpdate(id, {
      $set: {
        orderStatus: status,
      },
    });

    if (!orderUpdate) {
      return {
        status: STATUS_CODE.NOT_FOUND,
        message: "No order Found with this id",
      };
    }

    return {
      status: STATUS_CODE.OK,
      message: "Order Status Updated ",
    };
  } catch (error) {
    console.log("error in orderManagement Repository layer", error);
    throw error;
  }
};

//--------------------------------------------------------------------------------------------------------------

export const getOrderStatsForDashboardRepository = async () => {
  try {
    const stats = await Order.aggregate([
      {
        $facet: {
          totalCount: [
            {
              $count: "count",
            },
          ],

          topOrders: [
            {
              $sort: { _id: -1 },
            },
            {
              $limit: 10,
            },
            {
              $project: {
                _id: 1,
                totalAmount: 1,
                status: 1,
              },
            },
          ],

          last30DaysSales: [
            {
              $match: {
                status: "paid",
                createdAt: {
                  $gte: new Date(new Date().setDate(new Date().getDate() - 30)),
                },
              },
            },
            {
              $group: {
                _id: null,
                totalSales: { $sum: "$totalAmount" },
              },
            },
          ],
        },
      },

      {
        $project: {
          totalCount: { $arrayElemAt: ["$totalCount.count", 0] },
          topOrders: 1,
          last30DaysSales: {
            $ifNull: [{ $arrayElemAt: ["$last30DaysSales.totalSales", 0] }, 0],
          },
        },
      },
    ]);

    return stats ?? [];
  } catch (error) {
    console.log("error in Dashboard stats Repository layer", error);
    throw error;
  }
};

//--------------------------------------------------------------------------------------------------------

export const getGraphsStatsForDashboardRepository = async () => {
  try {
    const now = new Date();
    const day = now.getDay();

    const diffToMonday = day === 0 ? -6 : 1 - day;
    const startOfWeek = new Date(now.setDate(now.getDate() + diffToMonday));
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const stats = await Order.aggregate([
      {
        $match: {
          status: "paid",
          createdAt: {
            $gte: startOfWeek,
            $lte: endOfWeek,
          },
        },
      },
      {
        $addFields: {
          dayNumber: { $isoDayOfWeek: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$dayNumber",
          sales: { $sum: "$totalAmount" },
          orders: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          dayNumber: "$_id",
          sales: 1,
          orders: 1,
        },
      },
    ]);

    const daysMap = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const fullWeek = Array.from({ length: 7 }, (_, i) => {
      const found = stats.find((d) => d.dayNumber === i + 1);

      return {
        day: daysMap[i],
        sales: found ? found.sales : 0,
        orders: found ? found.orders : 0,
      };
    });

    const salesData = fullWeek.map((d) => ({
      day: d.day,
      sales: d.sales,
    }));

    const ordersData = fullWeek.map((d) => ({
      day: d.day,
      orders: d.orders,
    }));

    return {
      salesData,
      ordersData,
    };
  } catch (error) {
    console.log("error in Dashboard stats Repository layer", error);
    throw error;
  }
};

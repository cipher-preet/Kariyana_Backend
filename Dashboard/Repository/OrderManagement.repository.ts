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

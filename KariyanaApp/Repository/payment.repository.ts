import { IOrderData } from "../../types/OrderTypes";
import { razorpay } from "../../utils/RazorpayIntance";
import { Order } from "../Modals/order.model";


export const createOrderRepository = async (finalData: IOrderData) => {
  try {
    const { items, userId } = finalData;

    let totalAmount = 0;

    const formattedItems = items.map((item: any) => {
      const amount = item.price * item.quantity;
      totalAmount += amount;

      return {
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      };
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    const order = await Order.create({
      userId,
      items: formattedItems,
      totalAmount,
      razorpayOrderId: razorpayOrder.id,
      status: "pending",
    });

    return {
      order,
      razorpayOrder,
    };
  } catch (error) {
    console.log("error in payment Repository", error);
    throw error;
  }
};


//-----------------------------------------------------------------------------------------------


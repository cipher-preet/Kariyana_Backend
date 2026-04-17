import { Types } from "mongoose";
import { STATUS_CODE } from "../../Api";
import { IAddressSchema, IOrderData } from "../../types/OrderTypes";
import { razorpay } from "../../utils/RazorpayIntance";
import { DileveryAddress } from "../Modals/Address.modal";
import { Order } from "../Modals/order.model";
import { stat } from "node:fs";

export const createOrderRepository = async (finalData: IOrderData) => {
  try {
    const { items, userId, addressId } = finalData;

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
      addressId,
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

export const addDeliveryAddressRepository = async (
  finalData: IAddressSchema,
) => {
  try {
    const response = DileveryAddress.create(finalData);

    if (!response) {
      return {
        status: STATUS_CODE.BAD_REQUEST,
        message: "Error while Adding delevery Address",
      };
    }

    return {
      status: STATUS_CODE.OK,
      message: "Dilevery Address Added !",
    };
  } catch (error) {
    console.log("error in payment Repository", error);
    throw error;
  }
};

//--------------------------------------------------------------------------------------------------

export const getUserDileveryAddressRepository = async (userId: string) => {
  try {
    const response = await DileveryAddress.find({
      userId: new Types.ObjectId(userId),
    });

    return response ?? [];
  } catch (error) {
    console.log("error in payment Repository", error);
    throw error;
  }
};

//--------------------------------------------------------------------------------------------------

export const getOrderStatusRepository = async (orderId: string) => {
  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return {
        status: STATUS_CODE.NOT_FOUND,
        message: "Order not found",
      };
    }

    return {
      _id: order._id,
      status: order.status,
      totalAmount: order.totalAmount,
      razorpayOrderId: order.razorpayOrderId,
      razorpayPaymentId: order.razorpayPaymentId,
    };
  } catch (error) {
    console.log("error in payment Repository", error);
    throw error;
  }
};

//--------------------------------------------------------------------------------------------------------------------

export const updateDeliveryAddressRepository = async (
  finalData: IAddressSchema,
) => {
  try {
    const { id, name, phone, houseVillage, areaStreet, city, pincode, type } =
      finalData;

    const updatePayload = {
      ...(phone !== undefined && { phone }),
      ...(name !== undefined && { name }),
      ...(houseVillage !== undefined && { houseVillage }),
      ...(areaStreet !== undefined && { areaStreet }),
      ...(city !== undefined && { city }),
      ...(pincode !== undefined && { pincode }),
      ...(type !== undefined && { type }),
    };
    const addressUpdate = await DileveryAddress.findByIdAndUpdate(id, {
      $set: updatePayload,
    });

    if (!addressUpdate) {
      return {
        status: STATUS_CODE.BAD_REQUEST,
        message: "Error while updating address",
      };
    }

    return {
      status: STATUS_CODE.OK,
      message: "Address Updated Successfully",
    };
  } catch (error) {
    console.log("error in payment Repository", error);
    throw error;
  }
};

//--------------------------------------------------------------------------------------------------------------------

export const deleteDeliveryAddressRepository = async (id: string) => {
  try {
    const deleteAddress = await DileveryAddress.findByIdAndDelete(id);

    if (!deleteAddress) {
      return {
        status: STATUS_CODE.BAD_REQUEST,
        message: "Error while Deleting address",
      };
    }

    return {
      status: STATUS_CODE.OK,
      message: "Address Deleting Successfully",
    };
  } catch (error) {
    console.log("error in payment Repository", error);
    throw error;
  }
};

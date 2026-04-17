import crypto from "crypto";
import { ErrorResponse, STATUS_CODE, SuccessResponse } from "../../Api";
import { NextFunction, Request, Response } from "express";
import {
  createOrderServices,
  addDeliveryAddressServices,
  getUserDileveryAddressServices,
  getOrderStatusServices,
  updateDeliveryAddressServices,
  deleteDeliveryAddressServices,
} from "../Services/payment.services";
import { IAddressSchema, IOrderData } from "../../types/OrderTypes";
import { Order } from "../Modals/order.model";

//-------------------------------------------------------------------------------------------
const createOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { items, userId, addressId } = req.body;

    if (!userId || typeof userId !== "string") {
      return ErrorResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        "Valid userId is required",
      );
    }

    if (!items || !Array.isArray(items)) {
      return ErrorResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        "Items must be an array",
      );
    }

    if (items.length === 0) {
      return ErrorResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        "Items array cannot be empty",
      );
    }

    const finalData: IOrderData = {
      userId,
      addressId,
      items,
    };

    const response = await createOrderServices(finalData);

    SuccessResponse(res, STATUS_CODE.OK, response);
  } catch (error) {
    next(error);
  }
};

//-------------------------------------------------------------------------------------------------

const razorpayWebhookController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const body = req.body;

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;

    const signature = req.headers["x-razorpay-signature"] as string;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      return ErrorResponse(res, STATUS_CODE.BAD_REQUEST, "Invalid signature");
    }

    const event = JSON.parse(req.body.toString());

    const payment = event.payload.payment.entity;

    const orderId = payment.order_id;

    if (event.event === "payment.captured") {
      await Order.findOneAndUpdate(
        { razorpayOrderId: orderId },
        {
          status: "paid",
          razorpayPaymentId: payment.id,
        },
      );
    }

    if (event.event === "payment.failed") {
      await Order.findOneAndUpdate(
        { razorpayOrderId: orderId },
        {
          status: "failed",
        },
      );
    }

    SuccessResponse(res, STATUS_CODE.OK, { recieved: true });
  } catch (error) {
    next(error);
  }
};

//--------------------------------------------------------------------------------------------------

const addDeliveryAddressController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const {
      userId,
      name,
      phone,
      houseVillage,
      areaStreet,
      city,
      pincode,
      type,
    } = req.body;

    const finalData: IAddressSchema = {
      userId,
      name,
      phone,
      houseVillage,
      areaStreet,
      city,
      pincode,
      type,
    };

    const response = await addDeliveryAddressServices(finalData);

    if (response.status === STATUS_CODE.BAD_REQUEST) {
      return ErrorResponse(res, response.status, response.message);
    }

    SuccessResponse(res, STATUS_CODE.OK, response);
  } catch (error) {
    next(error);
  }
};

//-------------------------------------------------------------------------------------------------

const getUserDileveryAddressController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const userId = req.query.userId as string;

    const response = await getUserDileveryAddressServices(userId);
    SuccessResponse(res, STATUS_CODE.OK, response);
  } catch (error) {
    next(error);
  }
};

//------------------------------------------------------------------------------------------------------

const getOrderStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const orderId = req.query.orderId as string;

    const response = await getOrderStatusServices(orderId);

    if (response.status === STATUS_CODE.NOT_FOUND) {
      return ErrorResponse(res, response.status, response.message);
    }

    SuccessResponse(res, STATUS_CODE.OK, response);
  } catch (error) {
    next(error);
  }
};

//------------------------------------------------------------------------------------------------------------------------------------

export const updateDeliveryAddressController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { id, name, phone, houseVillage, areaStreet, city, pincode, type } =
      req.body;

    const finalData: IAddressSchema = {
      id,
      name,
      phone,
      houseVillage,
      areaStreet,
      city,
      pincode,
      type,
    };

    const response = await updateDeliveryAddressServices(finalData);

    if (response.status === STATUS_CODE.BAD_REQUEST) {
      return ErrorResponse(res, response.status, response.message);
    }

    SuccessResponse(res, STATUS_CODE.OK, response);
  } catch (error) {
    next(error);
  }
};

//---------------------------------------------------------------------------------------------------------------------------

export const deleteDeliveryAddressController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const id = req.query.id as string;

    const response = await deleteDeliveryAddressServices(id);

    if (response.status === STATUS_CODE.BAD_REQUEST) {
      return ErrorResponse(res, response.status, response.message);
    }

    SuccessResponse(res, STATUS_CODE.OK, response);
  } catch (error) {
    next(error);
  }
};

//---------------------------------------------
export {
  createOrderController,
  razorpayWebhookController,
  addDeliveryAddressController,
  getUserDileveryAddressController,
  getOrderStatusController,
};

import { STATES, Types } from "mongoose";
import { BrandModel } from "../Modals/Brand.modal";
import { STATUS_CODE } from "../../Api";
import { IcontactusType, IUnitInterface } from "../../types/Dashboardtypes";
import { UnitModal } from "../Modals/Unit.modal";
import { TagModel } from "../Modals/Tags.modal";
import { cartSchemaModel } from "../Modals/cart.model";
import { contactModal } from "../Modals/Contactus.modal";
import { generateCloudFrontSignedUrl } from "../../utils/cloudfrontSigner";
import { Order } from "../../KariyanaApp/Modals/order.model";

//-----------------------------------------------------------------------------------------------------

export const addBrandRepository = async (name: string, description: string) => {
  try {
    const response = await BrandModel.create({
      name,
      description,
    });

    if (!response) {
      return {
        status: STATUS_CODE.INTERNAL_SERVER_ERROR,
        message: "error while creating brand",
      };
    }

    return {
      status: STATUS_CODE.OK,
      message: "Brand Created Successfully",
    };
  } catch (error) {
    console.log("error in brand and unit repository", error);
    throw error;
  }
};

//----------------------------------------------------------------------------------------------

export const addUnitRepository = async (data: IUnitInterface) => {
  try {
    const response = await UnitModal.create(data);

    if (!response) {
      return {
        status: STATUS_CODE.INTERNAL_SERVER_ERROR,
        message: "error while creating Unit",
      };
    }

    return {
      status: STATUS_CODE.OK,
      message: "Unit Created Successfully",
    };
  } catch (error) {
    console.log("error in brand and unit repository", error);
    throw error;
  }
};

//----------------------------------------------------------------------------------------------

export const editBrandRepository = async (
  _id: string,
  name: string,
  description: string,
) => {
  try {
    const response = await BrandModel.findByIdAndUpdate(_id, {
      $set: {
        name,
        description,
      },
    });

    console.log(response);

    if (!response) {
      return {
        status: STATUS_CODE.INTERNAL_SERVER_ERROR,
        message: "error while updating brand",
      };
    }

    return {
      status: STATUS_CODE.OK,
      message: "Brand Updated Successfully",
    };
  } catch (error) {
    console.log("error in brand and unit repository", error);
    throw error;
  }
};

//----------------------------------------------------------------------------------------------
export const editUnitRepository = async (data: IUnitInterface) => {
  try {
    const response = await UnitModal.findByIdAndUpdate(data._id, {
      $set: {
        name: data.name,
        shortName: data.shortName,
        baseUnit: data.baseUnit,
        multiplier: data.multiplier,
      },
    });
    if (!response) {
      return {
        status: STATUS_CODE.INTERNAL_SERVER_ERROR,
        message: "error while updating Unit",
      };
    }

    return {
      status: STATUS_CODE.OK,
      message: "Unit Updated Successfully",
    };
  } catch (error) {
    console.log("error in brand and unit repository", error);
    throw error;
  }
};

//--------------------------------------------------------------------------------------

export const getBrandsForFormsRepository = async () => {
  try {
    const getBrands = await BrandModel.find({ isActive: true }).select("name");
    if (!getBrands) {
      return [];
    }
    return getBrands;
  } catch (error) {
    console.log("error in brand and unit repository", error);
    throw error;
  }
};

//---------------------------------------------------------------------------------------

export const getUnitRepository = async () => {
  try {
    const getUnit = await UnitModal.find({ isActive: true }).select("name");
    if (!getUnit) {
      return [];
    }
    return getUnit;
  } catch (error) {
    console.log("error in brand and unit repository", error);
    throw error;
  }
};

//---------------------------------------------------------------------------------------

export const getUnitFordashboardRepository = async () => {
  try {
    const getUnit = await UnitModal.find()
      .select("-createdAt -updatedAt -__v")
      .lean();

    if (!getUnit) {
      return [];
    }
    return getUnit;
  } catch (error) {
    console.log("error in brand and unit repository", error);
    throw error;
  }
};

//---------------------------------------------------------------------------------------
export const getBrandFordashboardRepository = async () => {
  try {
    const getBrands = await BrandModel.find().select(
      "-createdAt -updatedAt -__v",
    );
    if (!getBrands) {
      return [];
    }
    return getBrands;
  } catch (error) {
    console.log("error in brand and unit repository", error);
    throw error;
  }
};

//------------------------------------------------------------------------------------

export const addTagsRepository = async (name: string) => {
  try {
    const addTags = await TagModel.create({
      name,
    });

    if (!addTags) {
      return {
        status: STATUS_CODE.INTERNAL_SERVER_ERROR,
        message: "error while creating Tags",
      };
    }

    return {
      status: STATUS_CODE.OK,
      message: "Tags Created Successfully",
    };
  } catch (error) {
    console.log("error in brand and unit repository", error);
    throw error;
  }
};

//------------------------------------------------------------------------------------

export const getTagsRepository = async () => {
  try {
    const getTags = await TagModel.find({}).select("-__v");
    return getTags ?? [];
  } catch (error) {
    console.log("error in brand and unit repository", error);
    throw error;
  }
};

//--------------------------------------------------------------------------------------

export const editTagRepository = async (
  _id: string,
  name: string,
  isActive: boolean,
) => {
  try {
    const editTags = await TagModel.findByIdAndUpdate(_id, { name, isActive });
    if (!editTags) {
      return {
        status: STATUS_CODE.BAD_REQUEST,
        message: "Error while Updating tags",
      };
    }
    return {
      status: STATUS_CODE.OK,
      message: "Tags Update successfully",
    };
  } catch (error) {
    console.log("error in brand and unit repository", error);
    throw error;
  }
};

//---------------------------------------------------------------------------------------
type PopulatedProduct = {
  _id: Types.ObjectId;
  name: string;
  images: string[];
  unit: string;
  quantityPerUnit: string;
};

type CartItemPopulated = {
  productId: PopulatedProduct;
  quantity: number;
  price: number;
};

type CartPopulated = {
  userId: Types.ObjectId;
  items: CartItemPopulated[];
  totalItems: number;
  subtotal: number;
  lastUpdatedAt: number;
};

export const getuserCartDataForDashboardRepository = async (userId: string) => {
  try {
    const cartDetails = await cartSchemaModel
      .findOne({ userId })
      .populate({
        path: "items.productId",
        select: "name images unit quantityPerUnit",
      })
      .lean<CartPopulated>();

    if (!cartDetails) {
      return {
        status: STATUS_CODE.NOT_FOUND,
        message: "Empty Cart",
      };
    }

    const FinalResponse = {
      userId: cartDetails?.userId,
      items: cartDetails?.items.map((item) => {
        const { images, ...productWithoutImages } = item?.productId as any;

        return {
          productId: productWithoutImages._id,
          name: productWithoutImages.name,
          quantity: item.quantity,
          price: item.price,
          image: images?.length ? generateCloudFrontSignedUrl(images[0]) : null,
          unit: productWithoutImages.unit,
          quantityPerUnit: productWithoutImages.quantityPerUnit,
        };
      }),
      totalItems: cartDetails?.totalItems,
      subtotal: cartDetails?.subtotal,
      lastUpdatedAt: cartDetails?.lastUpdatedAt,
    };

    return FinalResponse;
  } catch (error) {
    console.log("error in cart repository", error);
    throw error;
  }
};

//---------------------------------------------------------------------------------------

export const contactUsPageForWebsiteRepository = async (
  finalData: IcontactusType,
) => {
  try {
    const response = await contactModal.create(finalData);

    if (!response) {
      return {
        status: STATUS_CODE.BAD_REQUEST,
        message: "Error while try to Contact ! wait and try ...",
      };
    }

    return {
      status: STATUS_CODE.OK,
      message: "Thanks for been contacting !!! ",
    };
  } catch (error) {
    console.log("error in cart repository", error);
    throw error;
  }
};

//----------------------------------------------------------------------------------

export const getContactUsPageDetailsFromWebsiteRepository = async () => {
  try {
    const response = await contactModal
      .find({})
      .sort({ _id: -1 })
      .select("-__v -updatedAt");
    return response ?? [];
  } catch (error) {
    console.log("error in cart repository", error);
    throw error;
  }
};

//-------------------------------------------------------------------------------

export const markAsReadInContactUsRepository = async (queryId: string) => {
  try {
    const response = await contactModal.findByIdAndUpdate(queryId, {
      isAction: true,
    });

    if (!response) {
      return {
        status: STATUS_CODE.NOT_FOUND,
        message: "Contact us query not Found",
      };
    }

    return {
      status: STATUS_CODE.OK,
      message: "Action Perform Sucessfully !!!",
    };
  } catch (error) {
    console.log("error in cart repository", error);
    throw error;
  }
};

//-----------------------------------------------------------------------------------------

export const getUserOrderHistoryByUserIdRepository = async (
  userId: string,
  limit: number = 10,
  cursor?: string,
) => {
  try {
    const query: any = {
      userId,
    };

    if (cursor) {
      query._id = { $lt: new Types.ObjectId(cursor) };
    }

    const userOrderData = await Order.find(query)
      .select("-razorpayOrderId -updatedAt -userId -__v -razorpayPaymentId")
      .populate({ path: "addressId", select: "-userId -_id -__v" })
      .sort({ _id: -1 })
      .limit(limit + 1)
      .lean();

    const hasNextPage = userOrderData.length > limit;

    if (hasNextPage) {
      userOrderData.pop();
    }

    return {
      userOrderData,
      nextCursor: hasNextPage
        ? userOrderData[userOrderData.length - 1]._id
        : null,
      hasNextPage,
    };
  } catch (error) {
    console.log("error in cart repository", error);
    throw error;
  }
};

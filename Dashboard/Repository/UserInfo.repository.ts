import { Types } from "mongoose";
import { ShopProfileModel } from "../../AuthenticationModule/Modals/ShopProfile.modal";
import { STATUS_CODE } from "../../Api";
import { User } from "../../AuthenticationModule/Modals/User.Modals";

//--------------------------------------------------------------------------------------------------

export const getUserProfileForCardsInDashboardrepository = async (
  limit: number = 10,
  cursor?: string,
) => {
  try {
    const query: any = {
      isApprove: true,
    };

    if (cursor) {
      query._id = { $lt: new Types.ObjectId(cursor) };
    }

    const userData = await ShopProfileModel.find(query)
      .select("shopName ownerName address documents")
      .sort({ _id: 1 })
      .limit(limit + 1)
      .lean();

    const hasNextPage = userData.length > limit;

    if (hasNextPage) {
      userData.pop();
    }

    return {
      userData,
      nextCursor: hasNextPage ? userData[userData.length - 1]._id : null,
      hasNextPage,
    };
  } catch (error) {
    console.log("this error is inside User Info Repository ", error);
    throw error;
  }
};

//--------------------------------------------------------------------------------------------

export const getUserAdditionalProfileDetailRepository = async (
  shopId: string,
) => {
  try {
    const shopData: any = await ShopProfileModel.findById(shopId)
      .lean()
      .select("-createdAt -updatedAt -__v -isApprove -documents")
      .populate({ path: "userId", select: "phone" });

    const { userId, ...finalShopData } = shopData;
    finalShopData.phone = userId.phone;

    if (!shopData) {
      return {
        status: STATUS_CODE.NOT_FOUND,
        message: "No shop Details is present.",
      };
    }

    return finalShopData;
  } catch (error) {
    console.log("this error is inside User Info Repository ", error);
    throw error;
  }
};

//----------------------------------------------------------------------------------------------

export const approveShopRepository = async (shopId: string) => {
  try {
    const shop = await ShopProfileModel.findById(shopId);

    if (!shop) {
      return {
        status: STATUS_CODE.NOT_FOUND,
        message: "Shop not Found For Approval",
      };
    }

    await Promise.all([
      ShopProfileModel.updateOne(
        { _id: shopId },
        { $set: { isApprove: true } },
      ),
      User.updateOne({ _id: shop.userId }, { $set: { status: "APPROVED" } }),
    ]);

    return {
      status: STATUS_CODE.OK,
      message: "Shop Approved Successfully",
    };
  } catch (error) {
    console.log("this error is inside User Info Repository ", error);
    throw error;
  }
};

//------------------------------------------------------------------------------------------------------

export const getPendingApprovalProfileCardsInDashboardRepository = async (
  limit: number = 10,
  cursor?: string,
) => {
  try {
    const query: any = {
      isApprove: false,
    };

    if (cursor) {
      query._id = { $lt: new Types.ObjectId(cursor) };
    }

    const userData = await ShopProfileModel.find(query)
      .select("shopName ownerName address documents")
      .sort({ _id: 1 })
      .limit(limit + 1)
      .lean();

    const hasNextPage = userData.length > limit;

    if (hasNextPage) {
      userData.pop();
    }

    return {
      userData,
      nextCursor: hasNextPage ? userData[userData.length - 1]._id : null,
      hasNextPage,
    };
  } catch (error) {
    console.log("this error is inside User Info Repository ", error);
    throw error;
  }
};

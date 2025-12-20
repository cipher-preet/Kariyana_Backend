import { STATUS_CODE } from "../../Api";
import { IProduct } from "../../types/Dashboardtypes";
import { productModel } from "../Modals/Product.modals";
// ------------------------------------------------------------------------------------------------

export const addNewProductRepository = async (finalData: IProduct) => {
  try {
    const response = await productModel.create(finalData);

    if (!response) {
      return {
        status: STATUS_CODE.BAD_REQUEST,
        message: "Server error while creating the Product",
      };
    }

    return {
      status: STATUS_CODE.OK,
      message: "Product created Successfully",
    };
  } catch (error) {
    console.log("error in product repository", error);
    throw error;
  }
};

//------------------------------------------------------------------------------------------------

export const editProductRepository = async (
  finalData: IProduct,
  productId: string
) => {
  try {
    const response = await productModel.findByIdAndUpdate(
      productId,
      { $set: finalData },
      { new: true }
    );

    if (!response) {
      return {
        status: STATUS_CODE.BAD_REQUEST,
        message: "Server error while updating the Product",
      };
    }

    return {
      status: STATUS_CODE.OK,
      message: "Product update Successfully",
    };
  } catch (error) {
    console.log("error in product repository", error);
    throw error;
  }
};

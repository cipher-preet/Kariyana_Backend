import { STATUS_CODE } from "../../Api";
import { ParentCategoryModel } from "../Modals/Category.modal";
import { childCategoryModel } from "../Modals/ChildCategory.modal";

export const addParentCategoryRepository = async (
  name: string,
  images: Array<string>
) => {
  try {
    if (!images?.length) {
      throw new Error("Image is required");
    }

    const result = await ParentCategoryModel.create({
      name,
      image: images[0],
    });

    if (!result) {
      return {
        status: STATUS_CODE.BAD_REQUEST,
        message: "error is creating the parent category",
      };
    }

    return {
      status: STATUS_CODE.OK,
      message: "Parent Category Created Successfully",
    };
  } catch (error) {
    console.log("this is the error in category repository ", error);
    throw error;
  }
};

//---------------------------------------------------------------------------------------------------
export const addChildtCategoryRepository = async (
  name: string,
  parentcategoryId: string,
  images: Array<string>
) => {
  try {
    if (!images?.length) {
      throw new Error("Image is required");
    }

    const result = await childCategoryModel.create({
      name,
      parentCategoryId: parentcategoryId,
      image: images[0],
    });

    if (!result) {
      return {
        status: STATUS_CODE.BAD_REQUEST,
        message: "error is creating the Child category",
      };
    }

    return {
      status: STATUS_CODE.OK,
      message: "Child Category Created Successfully",
    };
  } catch (error) {
    console.log("this is the error in category repository ", error);
    throw error;
  }
};

//-----------------------------------------------------------------------------------------------

export const editParentCategoryRepository = async (
  name: string,
  id: string,
  finalImages: Array<string>
) => {
  try {
    const response = await ParentCategoryModel.findByIdAndUpdate(id, {
      $set: {
        name,
        image: finalImages,
      },
    });

    if (!response) {
      return {
        status: STATUS_CODE.BAD_REQUEST,
        message: "Server error while updating the Parent Category",
      };
    }

    return {
      status: STATUS_CODE.OK,
      message: " Parent Category update Successfully",
    };
  } catch (error) {
    console.log("this is the error in category repository ", error);
    throw error;
  }
};

//-----------------------------------------------------------------------------------------------

export const editChildCategoryRepository = async () => {
  try {
  } catch (error) {
    console.log("this is the error in category repository ", error);
    throw error;
  }
};

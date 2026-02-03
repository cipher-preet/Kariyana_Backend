import { Types } from "mongoose";
import { STATUS_CODE } from "../../Api";
import { ParentCategoryModel } from "../Modals/Category.modal";
import { childCategoryModel } from "../Modals/ChildCategory.modal";

export const addParentCategoryRepository = async (
  name: string,
  images: Array<string>,
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
  images: Array<string>,
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
  finalImages: Array<string>,
) => {
  try {
    const response = await ParentCategoryModel.findByIdAndUpdate(id, {
      $set: {
        name,
        image: finalImages[0],
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
      message: "Parent Category update Successfully",
    };
  } catch (error) {
    console.log("this is the error in category repository ", error);
    throw error;
  }
};

//-----------------------------------------------------------------------------------------------

export const editChildCategoryRepository = async (
  id: string,
  name: string,
  finalImages: Array<string>,
  parentcategoryId: string,
) => {
  try {
    const response = await childCategoryModel.findByIdAndUpdate(id, {
      $set: {
        name,
        image: finalImages[0],
        parentcategoryId,
      },
    });

    if (!response) {
      return {
        status: STATUS_CODE.BAD_REQUEST,
        message: "Server error while updating the Child Category Category",
      };
    }

    return {
      status: STATUS_CODE.OK,
      message: "child Category update Successfully",
    };
  } catch (error) {
    console.log("this is the error in category repository ", error);
    throw error;
  }
};

//-------------------------------------------------------------------------------------------------

export const getParentCategoriesRepository = async (
  cursor?: string | undefined,
  limit = 10,
) => {
  try {
    const query: any = {};
    if (cursor) {
      query._id = { $lt: new Types.ObjectId(cursor) };
    }
    const limit = 10;

    const categories = await ParentCategoryModel.find()
      .sort({ _id: -1 })
      .limit(limit + 1)
      .select({
        name: 1,
        image: 1,
        isActive: 1,
      })
      .lean();

    const hasNextPage = categories.length > limit;
    if (hasNextPage) {
      categories.pop();
    }

    return {
      categories,
      nextCursor: hasNextPage ? categories[categories.length - 1]._id : null,
      hasNextPage,
    };
  } catch (error) {
    console.log("this is the error in category repository ", error);
    throw error;
  }
};

//-------------------------------------------------------------------------------------------------

export const getChildCategoryByParentIdRepository = async (
  cursor: string | undefined,
  ParentCategoryId: string,
  limit: number,
) => {
  try {
    const query: any = {
      parentCategoryId: new Types.ObjectId(ParentCategoryId),
      isActive: true,
    };
    console.log();

    if (cursor) {
      query._id = { $lt: new Types.ObjectId(cursor) };
    }

    const childcat = await childCategoryModel
      .find(query)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .select({ name: 1, image: 1 })
      .lean();

    const hasNextPage = childcat.length > limit;

    if (hasNextPage) {
      childcat.pop();
    }

    return {
      childcat,
      nextCursor: hasNextPage ? childcat[childcat.length - 1]._id : null,
      hasNextPage,
    };
  } catch (error) {
    console.log("this is the error in category repository ", error);
    throw error;
  }
};

//-------------------------------------------------------------------------------------------------

export const getParentCategoriesForFormsRepository = async () => {
  try {
    const categories = await ParentCategoryModel.find({ isActive: true })
      .select({ name: 1, _id: 1 })
      .lean();

    if (!categories) {
      return [];
    }

    return categories;
  } catch (error) {
    console.log("this is the error in category repository ", error);
    throw error;
  }
};

//-------------------------------------------------------------------------------------------------
export const getchildCategoriesForFormsRepository = async (
  ParentCategoryId?: string,
) => {
  try {
    if (!ParentCategoryId) {
      return [];
    }

    const categories = await childCategoryModel
      .find({ parentCategoryId: ParentCategoryId, isActive: true })
      .select({ name: 1, _id: 1 })
      .lean();

    if (!categories) {
      return [];
    }

    return categories;
  } catch (error) {
    console.log("this is the error in category repository ", error);
    throw error;
  }
};

//--------------------------------------------------------------------------------------------------

export const getAllChildCategoriesRepository = async () => {
  try {
    const childCategoryresult = await childCategoryModel
      .find({
        isActive: true,
      })
      .select("name");

    if (!childCategoryresult) {
      return [];
    }

    return childCategoryresult;
  } catch (error) {
    console.log("this is the error in category repository ", error);
    throw error;
  }
};

//----------------------------------------------------------------------------------------------


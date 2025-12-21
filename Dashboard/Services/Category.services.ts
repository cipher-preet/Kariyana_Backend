import {
  addParentCategoryRepository,
  addChildtCategoryRepository,
  editParentCategoryRepository,
  editChildCategoryRepository,
} from "../Repository/Category.repository";

export const addParentCategoryServices = async (
  name: string,
  images: Array<string>
) => {
  try {
    const response = await addParentCategoryRepository(name, images);
    return response;
  } catch (error) {
    console.log("this error is inside Category services ", error);
    throw error;
  }
};
//--------------------------------------------------------------------------------
export const addChildtCategoryServices = async (
  name: string,
  parentcategoryId: string,
  images: Array<string>
) => {
  try {
    const response = await addChildtCategoryRepository(
      name,
      parentcategoryId,
      images
    );
    return response;
  } catch (error) {
    console.log("this error is inside Category services ", error);
    throw error;
  }
};

//------------------------------------------------------------------------------

export const editParentCategoryServices = async (
  name: string,
  id: string,
  finalImages: Array<string>
) => {
  try {
    const response = await editParentCategoryRepository(name, id, finalImages);
    return response;
  } catch (error) {
    console.log("this error is inside Category services ", error);
    throw error;
  }
};

//-------------------------------------------------------------------------

export const editChildCategoryServices = async (
  id: string,
  name: string,
  finalImages: Array<string>,
  parentcategoryId: string
) => {
  try {
    const response = await editChildCategoryRepository(
      id,
      name,
      finalImages,
      parentcategoryId
    );
    return response;
  } catch (error) {
    console.log("this error is inside Category services ", error);
    throw error;
  }
};

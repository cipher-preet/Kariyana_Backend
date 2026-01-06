import {
  addParentCategoryRepository,
  addChildtCategoryRepository,
  editParentCategoryRepository,
  editChildCategoryRepository,
  getParentCategoriesRepository,
  getChildCategoryByParentIdRepository,
  getParentCategoriesForFormsRepository,
  getchildCategoriesForFormsRepository,
} from "../Repository/Category.repository";

//-------------------------------------------------------------------------------

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

//------------------------------------------------------------------------------
export const getParentCategoriesService = (
  cursor: string | undefined,
  limit: number
) => {
  try {
    const response = getParentCategoriesRepository(cursor, limit);
    return response;
  } catch (error) {
    console.log("error in product app services", error);
    throw error;
  }
};

//-----------------------------------------------------------------------------

export const getChildCategoryByParentIdServices = async (
  cursor: string | undefined,
  ParentCategoryId: string,
  limit: number
) => {
  try {
    const response = await getChildCategoryByParentIdRepository(
      cursor,
      ParentCategoryId,
      limit
    );
    return response;
  } catch (error) {
    console.log("error in product app services", error);
    throw error;
  }
};
//-----------------------------------------------------------------------------
export const getParentCategoriesForFormsServices = async () => {
  try {
    const response = await getParentCategoriesForFormsRepository();
    return response;
  } catch (error) {
    console.log("error in product app services", error);
    throw error;
  }
};
//-----------------------------------------------------------------------------
export const getchildCategoriesForFormsServices = async (
  ParentCategoryId?: string
) => {
  try {
    const response = await getchildCategoriesForFormsRepository(
      ParentCategoryId
    );
    return response;
  } catch (error) {
    console.log("error in product app services", error);
    throw error;
  }
};

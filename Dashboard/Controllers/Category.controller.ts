import { ErrorResponse, STATUS_CODE, SuccessResponse } from "../../Api";
import { NextFunction, Request, Response } from "express";

import {
  addParentCategoryServices,
  addChildtCategoryServices,
  editParentCategoryServices,
  editChildCategoryServices,
  getParentCategoriesService,
  getChildCategoryByParentIdServices,
} from "../Services/Category.services";
import { generateCloudFrontSignedUrl } from "../../utils/cloudfrontSigner";
import { ParentCategory } from "./../Modals/Category.modal";

//---------------------------------------------------------------------------------------------
const addParentCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;

    let images: string[] = [];
    if (
      req.files &&
      (req as any).files.images &&
      Array.isArray((req as any).files.images)
    ) {
      images = (req as any).files.images.map((file: any) => file.key);
    }

    const response = await addParentCategoryServices(name, images);

    if ((response as { status: number }).status === STATUS_CODE.BAD_REQUEST) {
      return ErrorResponse(
        res,
        (response as { status: number }).status,
        "error while creating Parent Category"
      );
    }

    SuccessResponse(res, STATUS_CODE.OK, response);
  } catch (error) {
    next(error);
  }
};

//-----------------------------------------------------------------------------------------------------------
const addChildCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { name, parentcategoryId } = req.body;

    let images: string[] = [];
    if (
      req.files &&
      (req as any).files.images &&
      Array.isArray((req as any).files.images)
    ) {
      images = (req as any).files.images.map((file: any) => file.key);
    }

    const response = await addChildtCategoryServices(
      name,
      parentcategoryId,
      images
    );

    if ((response as { status: number }).status === STATUS_CODE.BAD_REQUEST) {
      return ErrorResponse(
        res,
        (response as { status: number }).status,
        "error while creating Parent Category"
      );
    }

    SuccessResponse(res, STATUS_CODE.OK, response);
  } catch (error) {
    next(error);
  }
};

//------------------------------------------------------------------------------------------------------

const editParentCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    let { name, id } = req.body;

    const existingImages: string[] =
      typeof req.body.existingImages === "string"
        ? JSON.parse(req.body.existingImages)
        : req.body.existingImages || [];

    let images: string[] = [];
    if (
      req.files &&
      (req as any).files.images &&
      Array.isArray((req as any).files.images)
    ) {
      images = (req as any).files.images.map((file: any) => file.key);
    }

    const finalImages = [...existingImages, ...images];

    const response = await editParentCategoryServices(name, id, finalImages);

    if ((response as { status: number }).status === STATUS_CODE.BAD_REQUEST) {
      return ErrorResponse(
        res,
        (response as { status: number }).status,
        "error while creating Parent Category"
      );
    }

    SuccessResponse(res, STATUS_CODE.OK, response);
  } catch (error) {
    next(error);
  }
};

//--------------------------------------------------------------------------------------------------

const editChildCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id, name, parentcategoryId } = req.body;

    const existingImages: string[] =
      typeof req.body.existingImages === "string"
        ? JSON.parse(req.body.existingImages)
        : req.body.existingImages || [];

    let images: string[] = [];
    if (
      req.files &&
      (req as any).files.images &&
      Array.isArray((req as any).files.images)
    ) {
      images = (req as any).files.images.map((file: any) => file.key);
    }

    const finalImages = [...existingImages, ...images];

    const response = await editChildCategoryServices(
      id,
      name,
      finalImages,
      parentcategoryId
    );

    if ((response as { status: number }).status === STATUS_CODE.BAD_REQUEST) {
      return ErrorResponse(
        res,
        (response as { status: number }).status,
        "error while editing child Category"
      );
    }

    SuccessResponse(res, STATUS_CODE.OK, response);
  } catch (error) {
    next(error);
  }
};

//----------------------------------------------------------------------------------------------------------

const getParentCategoriesController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { cursor } = req.query;
    const limit = Math.min(Number(req.query.limit) || 10, 50);

    const response = await getParentCategoriesService(
      cursor as string | undefined,
      limit
    );

    const categoriesWithSignedUrls = response.categories.map((cat: any) => ({
      ...cat,
      images: generateCloudFrontSignedUrl(cat.image),
    }));

    SuccessResponse(res, STATUS_CODE.OK, {
      categories: categoriesWithSignedUrls,
      nextCursor: response.nextCursor,
      hasNextPage: response.hasNextPage,
    });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------------------------------------------------

const getChildCategoryByParentIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const cursor =
      typeof req.query.cursor === "string" ? req.query.cursor : undefined;

    const ParentCategoryId =
      typeof req.query.ParentCategoryId === "string"
        ? req.query.ParentCategoryId
        : undefined;

    const limit = Math.min(Number(req.query.limit) || 10, 50);

    if (!ParentCategoryId) {
      return ErrorResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        "please provide ParentCategory Id"
      );
    }

    const response = await getChildCategoryByParentIdServices(
      cursor as string | undefined,
      ParentCategoryId,
      limit
    );

    const categoriesWithSignedUrls = response.childcat.map((cat: any) => ({
      ...cat,
      images: generateCloudFrontSignedUrl(cat.image),
    }));

    SuccessResponse(res, STATUS_CODE.OK, {
      categories: categoriesWithSignedUrls,
      nextCursor: response.nextCursor,
      hasNextPage: response.hasNextPage,
    });
  } catch (error) {
    next(error);
  }
};

//------------------------------------
export {
  addParentCategoryController,
  addChildCategoryController,
  editParentCategoryController,
  editChildCategoryController,
  getParentCategoriesController,
  getChildCategoryByParentIdController,
};

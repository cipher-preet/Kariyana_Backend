import { ErrorResponse, STATUS_CODE, SuccessResponse } from "../../Api";
import { NextFunction, Request, Response } from "express";
import {
  addNewProductServices,
  editProductServices,
} from "../Services/Product.services";
import { parseIfString } from "../../utils/helper";
import { IProduct } from "../../types/Dashboardtypes";
import { Types } from "mongoose";

const addNewProductController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    let {
      name,
      sku,
      categoryId,
      subcategoryId,
      brandId,
      mrp,
      sellingPrice,
      unit,
      quantityPerUnit,
      offPercentage,
      tag,
    } = req.body;

    let images: string[] = [];
    if (
      req.files &&
      (req as any).files.images &&
      Array.isArray((req as any).files.images)
    ) {
      images = (req as any).files.images.map((file: any) => file.key);
    }

    const finalData: IProduct = {
      name: parseIfString<string>(name)!,
      sku: parseIfString<number>(sku)!,
      categoryId: new Types.ObjectId(categoryId),
      subcategoryId: new Types.ObjectId(subcategoryId),
      brandId: new Types.ObjectId(brandId),
      mrp: parseIfString<number>(mrp)!,
      sellingPrice: parseIfString<number>(sellingPrice)!,
      unit: parseIfString<string>(unit)!,
      quantityPerUnit: parseIfString<number>(quantityPerUnit)!,
      offPercentage: parseIfString<number>(offPercentage) ?? 0,
      tag: parseIfString<string>(tag) ?? "",
      images,
    };

    const response = await addNewProductServices(finalData);

    if (response.status === STATUS_CODE.BAD_REQUEST) {
      return ErrorResponse(res, response.status, response.message);
    }

    SuccessResponse(res, response.status, response.message);
  } catch (error) {
    next(error);
  }
};

//-----------------------------------------------------------------------------------

const editProductController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    let {
      productId,
      name,
      sku,
      categoryId,
      subcategoryId,
      brandId,
      mrp,
      sellingPrice,
      unit,
      quantityPerUnit,
      offPercentage,
      tag,
    } = req.body;

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

    const finalData: IProduct = {
      name: parseIfString<string>(name)!,
      sku: parseIfString<number>(sku)!,
      categoryId: new Types.ObjectId(categoryId),
      subcategoryId: new Types.ObjectId(subcategoryId),
      brandId: new Types.ObjectId(brandId),
      mrp: parseIfString<number>(mrp)!,
      sellingPrice: parseIfString<number>(sellingPrice)!,
      unit: parseIfString<string>(unit)!,
      quantityPerUnit: parseIfString<number>(quantityPerUnit)!,
      offPercentage: parseIfString<number>(offPercentage) ?? 0,
      tag: parseIfString<string>(tag) ?? "",
      images: finalImages,
    };

    const response = await editProductServices(finalData, productId);

    if (response.status === STATUS_CODE.BAD_REQUEST) {
      return ErrorResponse(res, response.status, response.message);
    }

    SuccessResponse(res, response.status, response.message);
  } catch (error) {
    next(error);
  }
};
//------------------------------------
export { addNewProductController, editProductController };

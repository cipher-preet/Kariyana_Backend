import { ErrorResponse, STATUS_CODE, SuccessResponse } from "../../Api";
import { NextFunction, Request, Response } from "express";
import {
  addNewProductServices,
  editProductServices,
  getProductsBasicDetailsServices,
  addProductImagsAndHiglightsServices,
  getProductImagesAndHighlightsServices,
  getProductBasicInfoByChildCategoryIdServices,
  buildHomePageServices,
  getHomePageDetailsForDashboardServices,
  addProductCaresolsAndbannersServices,
} from "../Services/Product.services";
import { parseIfString } from "../../utils/helper";
import {
  IProduct,
  IProductHighlightsDetails,
} from "../../types/Dashboardtypes";
import { Types } from "mongoose";
import { generateCloudFrontSignedUrl } from "../../utils/cloudfrontSigner";
import { childCategory } from "../Modals/ChildCategory.modal";

const addNewProductController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    let {
      name,
      sku,
      categoryId,
      subcategoryId,
      brandId,
      mrp,
      marketPrice,
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
      marketPrice: parseIfString<number>(marketPrice)!,
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
  next: NextFunction,
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

// -----------------------------------------------------------------------------------------------------
// make changes its not final

const getProductsBasicDetailsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const limit = Number(req.query.limit) || 10;
    const cursor = req.query.cursor;

    const product = await getProductsBasicDetailsServices(
      limit,
      cursor as string | undefined,
    );

    const productsWithSignedUrl = product.products.map((product: any) => ({
      ...product,
      image: generateCloudFrontSignedUrl(product?.images[0]),
    }));

    SuccessResponse(res, STATUS_CODE.OK, {
      products: productsWithSignedUrl,
      nextCursor: product.nextCursor,
      hasNextPage: product.hasNextPage,
    });
  } catch (error) {
    next(error);
  }
};
//--------------------------------------------------------------------------------------

const addProductImagsAndHiglightsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    let { productId, heighlights } = req.body;

    let images: string[] = [];
    if (
      req.files &&
      (req as any).files.images &&
      Array.isArray((req as any).files.images)
    ) {
      images = (req as any).files.images.map((file: any) => file.key);
    }

    const finalData: IProductHighlightsDetails = {
      productId: productId,
      heighlights: JSON.parse(heighlights),
      images: images,
    };

    const response = await addProductImagsAndHiglightsServices(finalData);

    if (!response) {
      return ErrorResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        "Failed to add product images and highlights",
      );
    }
    if (response.status === STATUS_CODE.BAD_REQUEST) {
      return ErrorResponse(res, response.status, response.message);
    }

    SuccessResponse(res, response.status, response.message);
  } catch (error) {
    next(error);
  }
};

//-----------------------------------------------------------------------------------------------------------------

const getProductImagesAndHighlightsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const productId = req.query.productId as string;

    const response = await getProductImagesAndHighlightsServices(productId);

    if (!response) {
      return ErrorResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        "Failed to add product images and highlights",
      );
    }

    if (response.status === STATUS_CODE.BAD_REQUEST) {
      return ErrorResponse(
        res,
        response.status,
        (response as { message: string }).message,
      );
    }

    SuccessResponse(res, response.status, response);
  } catch (error) {
    next(error);
  }
};

//---------------------------------------------------------------------------------------------------------

const getProductBasicInfoByChildCategoryIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const childCategoryId = req.query.childCategoryId;

    const response = await getProductBasicInfoByChildCategoryIdServices(
      childCategoryId as string,
    );

    const productsWithSignedUrls = response.map((product: any) => ({
      ...product,
      images: product.images.map((key: string) =>
        generateCloudFrontSignedUrl(key),
      ),
    }));

    SuccessResponse(res, STATUS_CODE.OK, productsWithSignedUrls);
  } catch (error) {
    next(error);
  }
};

//----------------------------------------------------------------------------------------------------------------

const buildHomePageController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { homepageDetails } = req.body;
    const response = await buildHomePageServices(homepageDetails);

    if (response.status === STATUS_CODE.BAD_REQUEST) {
      return ErrorResponse(res, response.status, response.message);
    }

    SuccessResponse(res, response.status, response.message);
  } catch (error) {
    next(error);
  }
};

//---------------------------------------------------------------------------------------------------------------------

const getHomePageDetailsForDashboardController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const response = await getHomePageDetailsForDashboardServices();
    SuccessResponse(res, STATUS_CODE.OK, response);
  } catch (error) {
    next(error);
  }
};

//---------------------------------------------------------------------------------------------------------------------

const addProductCaresolsAndbannersController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const keepBanners: string[] = req.body.keepBanners
      ? JSON.parse(req.body.keepBanners)
      : [];

    const keepCarosels: string[] = req.body.keepCarosels
      ? JSON.parse(req.body.keepCarosels)
      : [];

    let banners: string[] = [];
    let carosels: string[] = [];

    if (
      req.files &&
      (req as any).files.banners &&
      Array.isArray((req as any).files.banners)
    ) {
      banners = (req as any).files.banners.map((file: any) => file.key);
    }

    if (
      req.files &&
      (req as any).files.caresols &&
      Array.isArray((req as any).files.caresols)
    ) {
      carosels = (req as any).files.caresols.map((file: any) => file.key);
    }

    const response = await addProductCaresolsAndbannersServices(
      banners,
      carosels,
      keepBanners,
      keepCarosels,
    );

    if (response.status === STATUS_CODE.BAD_REQUEST) {
      return ErrorResponse(res, response.status, response.message);
    }

    SuccessResponse(res, response.status, response.message);
  } catch (error) {
    next(error);
  }
};

//------------------------------------
export {
  addNewProductController,
  editProductController,
  getProductsBasicDetailsController,
  addProductImagsAndHiglightsController,
  getProductImagesAndHighlightsController,
  getProductBasicInfoByChildCategoryIdController,
  buildHomePageController,
  getHomePageDetailsForDashboardController,
  addProductCaresolsAndbannersController,
};

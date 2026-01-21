import { Router } from "express";
//---------------------------------------------------------------
import {
  addNewProductController,
  editProductController,
  getProductsBasicDetailsController,
  addProductImagsAndHiglightsController,
  getProductImagesAndHighlightsController,
} from "./Controllers/Product.controller";
//---------------------------------------------------------------
import {
  addParentCategoryController,
  addChildCategoryController,
  editParentCategoryController,
  editChildCategoryController,
  getParentCategoriesController,
  getChildCategoryByParentIdController,
  getParentCategoriesForFormsController,
  getchildCategoriesForFormsController,
} from "./Controllers/Category.controller";
//---------------------------------------------------------------
import {
  addBrandController,
  addUnitController,
  editBrandController,
  editUnitController,
  getBrandsForFormsController,
  getUnitController,
  getUnitFordashboardController,
  getBrandFordashboardController,
  addTagsController
} from "./Controllers/BrandAndUnit.controller";
//---------------------------------------------------------------

import { uploadCategory } from "../Middleware/Multer/CateogryResources";
import { uploadProduct } from "../Middleware/Multer/ProductResources";
const router = Router();

// ---------------------- Products Routes ---------------------------
router.post(
  "/addNewProduct",
  uploadProduct.fields([
    {
      name: "images",
      maxCount: 5,
    },
  ]),
  addNewProductController
);

router.put(
  "/editProduct",
  uploadProduct.fields([
    {
      name: "images",
      maxCount: 5,
    },
  ]),
  editProductController
);

// ------------------- caetgory routes -------------------------------
router.post(
  "/addParentCategory",
  uploadCategory.fields([
    {
      name: "images",
      maxCount: 1,
    },
  ]),
  addParentCategoryController
);

router.post(
  "/addChildCategory",
  uploadCategory.fields([
    {
      name: "images",
      maxCount: 1,
    },
  ]),
  addChildCategoryController
);

router.put(
  "/editParentCategory",
  uploadCategory.fields([
    {
      name: "images",
      maxCount: 1,
    },
  ]),
  editParentCategoryController
);

router.put(
  "/editChildCategory",
  uploadCategory.fields([
    {
      name: "images",
      maxCount: 1,
    },
  ]),
  editChildCategoryController
);

// -------------------------- get API's ---------------------------------

router.get("/getParentCategories", getParentCategoriesController);

router.get("/getchildcategorybyparentId", getChildCategoryByParentIdController);

router.get("/getProductsBasicDetails", getProductsBasicDetailsController);

//---------------------- brand API's -----------------------
router.post("/addBrand", addBrandController);
router.post("/addUnit", addUnitController);

//---- edit APi's -------
router.put("/editBrand", editBrandController);
router.put("/editUnit", editUnitController);

// ------------------ add product images and more detail -------------------------
router.put(
  "/addProductImagsAndHiglights",
  uploadProduct.fields([
    {
      name: "images",
      maxCount: 5,
    },
  ]),
  addProductImagsAndHiglightsController
);

router.get(
  "/getProductImagesAndHighlights",
  getProductImagesAndHighlightsController
);

// ------------------------------------------------------------
router.get(
  "/getParentCategoriesForForms",
  getParentCategoriesForFormsController
);
router.get("/getchildCategoriesForForms", getchildCategoriesForFormsController);
router.get("/getBrandsForForms", getBrandsForFormsController);
router.get("/getUnit", getUnitController);

//-----------------------------------------------------------

router.get("/getUnitFordashboard", getUnitFordashboardController);
router.get("/getBrandFordashboard", getBrandFordashboardController);

//-----------   route for tag and banner page ----------------------
router.post("/addTags", addTagsController)

export default router;

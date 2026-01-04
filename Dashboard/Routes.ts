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
} from "./Controllers/Category.controller";
//---------------------------------------------------------------
import {
  addBrandController,
  addUnitController,
  editBrandController,
  editUnitController,
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

export default router;

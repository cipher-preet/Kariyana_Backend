import { Router } from "express";
import {
  addNewProductController,
  editProductController,
} from "./Controllers/Product.controller";
import {
  addParentCategoryController,
  addChildCategoryController,
  editParentCategoryController,
  editChildCategoryController,
} from "./Controllers/Category.controller";
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

router.put("/editChildCategory", editChildCategoryController);  //pending

export default router;

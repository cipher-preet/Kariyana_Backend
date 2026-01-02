import { Router } from "express";
import {
  getProductsBycategoryIdController,
  getAllChildCategoriesController,
  getProductByChildCategoryIdController,
} from "./Controllers/Productapp.controller";

const router = Router();

router.get(
  "/getProductsbycategoryid/:categoryId",
  getProductsBycategoryIdController
);

router.get("/getAllChildCategories", getAllChildCategoriesController);

router.get(
  "/getProductByChildCategoryId/:childCatId",
  getProductByChildCategoryIdController
);

export default router;

import { Router } from "express";
import {
  getProductsBycategoryIdController,
  getAllChildCategoriesController,
  getProductByChildCategoryIdController,
  syncCartController,
  getCartByUserIdController,
  incAndDecCartQuantityController,
  getHomePageBannerAndProductController,
  getParentcatandTagDataController,
  getTrendSectionDataForHomePageController,
} from "./Controllers/Productapp.controller";

const router = Router();

router.get(
  "/getProductsbycategoryid/:categoryId",
  getProductsBycategoryIdController,
);

router.get("/getAllChildCategories", getAllChildCategoriesController);

router.get(
  "/getProductByChildCategoryId/:childCatId",
  getProductByChildCategoryIdController,
);

router.post("/syncCart", syncCartController);

router.get("/getCartByUserId/:userId", getCartByUserIdController);

router.post("/incAndDecCartQuantity", incAndDecCartQuantityController);

//---------------------App Home Page Routes --------------------------------------

router.get(
  "/getHomePageBannerAndProduct",
  getHomePageBannerAndProductController,
);

router.get("/getParentcatandTagData", getParentcatandTagDataController);

router.get(
  "/getTrendSectionDataForHomePage",
  getTrendSectionDataForHomePageController,
);
//--------------------------------------------------------------------------------

export default router;

import { Router } from "express";
import {
  getProductsBycategoryIdController,
  getAllChildCategoriesController,
  getProductByChildCategoryIdController,
  syncCartController,
  getCartByUserIdController,
  incAndDecCartQuantityController,
  getHomePageBannerAndProductController
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

router.post("/syncCart", syncCartController);

router.get("/getCartByUserId/:userId", getCartByUserIdController);

router.post('/incAndDecCartQuantity', incAndDecCartQuantityController);


//---------------------App Home Page Routes --------------------------------------

router.get('/getHomePageBannerAndProduct', getHomePageBannerAndProductController);

//--------------------------------------------------------------------------------




export default router;

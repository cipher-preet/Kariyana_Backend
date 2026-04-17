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
  getRandomProductsForCartPageController,
  searchProductController,
  getOrderDetailByuserIdController,
  getProductsbyProductIdController,
  getOrderDetailWithOrderIdController,
  userRatingProductsController,
  shareAppFeedbackController,
} from "./Controllers/Productapp.controller";
import {
  createOrderController,
  addDeliveryAddressController,
  getUserDileveryAddressController,
  getOrderStatusController,
  updateDeliveryAddressController,
  deleteDeliveryAddressController,
} from "./Controllers/payment.controller";
import { uploadProduct } from "../Middleware/Multer/ProductResources";

const router = Router();

router.get(
  "/getProductsbycategoryid/:categoryId",
  getProductsBycategoryIdController,
);

router.get(
  "/getProductsbyProductId/:productId",
  getProductsbyProductIdController,
);

router.get("/getAllChildCategories", getAllChildCategoriesController);

router.get(
  "/getProductByChildCategoryId/:childCatId",
  getProductByChildCategoryIdController,
);

router.post("/syncCart", syncCartController);

router.get("/getCartByUserId/:userId", getCartByUserIdController);

router.post("/incAndDecCartQuantity", incAndDecCartQuantityController);

router.get(
  "/getRandomProductsForCartPage",
  getRandomProductsForCartPageController,
);

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

//---------------- Order And Payment -----------------------------------
router.post("/createOrder", createOrderController);
router.get("/getOrderStatus", getOrderStatusController);

router.post("/addDeliveryAddress", addDeliveryAddressController);
router.get("/getUserDileveryAddress", getUserDileveryAddressController);
router.put("/updateDeliveryAddress", updateDeliveryAddressController);
router.delete("/deleteDeliveryAddress", deleteDeliveryAddressController);
//----------------------------------------------------------------------
router.get("/searchProduct", searchProductController);

router.get("/getOrderDetailByuserId", getOrderDetailByuserIdController);
router.get("/getOrderDetailWithOrderId", getOrderDetailWithOrderIdController);

router.post("/userRatingProducts", userRatingProductsController);
router.post(
  "/shareAppFeedback",
  uploadProduct.fields([
    {
      name: "images",
      maxCount: 5,
    },
  ]),
  shareAppFeedbackController,
);

export default router;

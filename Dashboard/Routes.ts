import { Router } from "express";
//---------------------------------------------------------------
import {
  addNewProductController,
  editProductController,
  getProductsBasicDetailsController,
  addProductImagsAndHiglightsController,
  getProductImagesAndHighlightsController,
  getProductBasicInfoByChildCategoryIdController,
  buildHomePageController,
  getHomePageDetailsForDashboardController,
  addProductCaresolsAndbannersController,
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
  getAllChildCategoriesController,
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
  addTagsController,
  getTagsController,
  editTagController,
  getuserCartDataForDashboardController,
  contactUsPageForWebsiteController,
  getContactUsPageDetailsFromWebsiteController,
  markAsReadInContactUsController,
  getUserOrderHistoryByUserIdController,
} from "./Controllers/BrandAndUnit.controller";
//---------------------------------------------------------------
import {
  getUserProfileForCardsInDashboardController,
  getUserAdditionalProfileDetailController,
  approveShopController,
  getPendingApprovalProfileCardsInDashboardController,
} from "./Controllers/UserInfo.controller";
//-----------------------------------------------------------------------
import { getBannerAndCarsolsForDashboardController } from "./Controllers/BannerAndCaresols.controller";
//---------------------------------------------------------------
import {
  createTrendsController,
  getProductsForTrendBuildingController,
  getTrendsForDashboardController,
  deleteTrendsFromDashboardController,
  editTrendsController,
} from "./Controllers/TrendManagement.controller";

//------------------------------------------------------------------
import {
  getGraphsStatsForDashboardController,
  getOrderStatsForDashboardController,
  getUpcomingOrderDetailsforDashboardController,
  updateOrderStatusInOrderPageController,
} from "./Controllers/OrderManagement.controller";

//----------------------------------------------------------------
import { uploadCategory } from "../Middleware/Multer/CateogryResources";
import { uploadProduct } from "../Middleware/Multer/ProductResources";
import { BannerAndCaresolsUploads } from "../Middleware/Multer/BannerAndCaresols";
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
  addNewProductController,
);

router.put(
  "/editProduct",
  uploadProduct.fields([
    {
      name: "images",
      maxCount: 5,
    },
  ]),
  editProductController,
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
  addParentCategoryController,
);

router.post(
  "/addChildCategory",
  uploadCategory.fields([
    {
      name: "images",
      maxCount: 1,
    },
  ]),
  addChildCategoryController,
);

router.put(
  "/editParentCategory",
  uploadCategory.fields([
    {
      name: "images",
      maxCount: 1,
    },
  ]),
  editParentCategoryController,
);

router.put(
  "/editChildCategory",
  uploadCategory.fields([
    {
      name: "images",
      maxCount: 1,
    },
  ]),
  editChildCategoryController,
);

// -------------------------- get API's ---------------------------------
router.get("/getAllChildCategories", getAllChildCategoriesController);

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
  addProductImagsAndHiglightsController,
);

router.get(
  "/getProductImagesAndHighlights",
  getProductImagesAndHighlightsController,
);

// ------------------------------------------------------------
router.get(
  "/getParentCategoriesForForms",
  getParentCategoriesForFormsController,
);
router.get("/getchildCategoriesForForms", getchildCategoriesForFormsController);
router.get("/getBrandsForForms", getBrandsForFormsController);
router.get("/getUnit", getUnitController);

//-----------------------------------------------------------

router.get("/getUnitFordashboard", getUnitFordashboardController);
router.get("/getBrandFordashboard", getBrandFordashboardController);

//-----------   route for tag and banner page ----------------------
router.post("/addTags", addTagsController);
router.get("/getAllTags", getTagsController);
router.put("/editTags", editTagController);

//------------- dashboard UserSection all apis goes here --------------------------
router.get(
  "/getUserProfileForCardsInDashboard",
  getUserProfileForCardsInDashboardController,
);

router.get(
  "/getPendingApprovalProfileCardsInDashboard",
  getPendingApprovalProfileCardsInDashboardController,
);

router.get(
  "/getUserAdditionalProfileDetail",
  getUserAdditionalProfileDetailController,
);

router.post("/approveshop", approveShopController);

router.get(
  "/getProductBasicInfoByChildCategoryId",
  getProductBasicInfoByChildCategoryIdController,
);

//---------------------------------------------------------------------------------

//--------------------------- Build Home API's ---------------------------------
router.post("/buildHomePage", buildHomePageController);

router.get(
  "/getHomePageDetailsForDashboard",
  getHomePageDetailsForDashboardController,
);

router.post(
  "/addProductCaresolsAndbanners",
  BannerAndCaresolsUploads.fields([
    {
      name: "banners",
      maxCount: 5,
    },
    {
      name: "caresols",
      maxCount: 5,
    },
  ]),
  addProductCaresolsAndbannersController,
);

//------------------------------------------------------------------------------
// baneer and caresols for dashboard
router.get(
  "/getBannerAndCarsolsForDashboard",
  getBannerAndCarsolsForDashboardController,
);

//-------------- cart data API's ------------------
router.get(
  "/getuserCartDataForDashboard",
  getuserCartDataForDashboardController,
);

router.get(
  "/getUserOrderHistoryByUserId",
  getUserOrderHistoryByUserIdController,
);

//--------- contactus page api -----------
router.post("/contactuspage", contactUsPageForWebsiteController);
router.get(
  "/getcontactuspagedetailsfromwebsite",
  getContactUsPageDetailsFromWebsiteController,
);
router.post("/markasreadincontactus", markAsReadInContactUsController);

//----------------  Trend Management Api --------------------------------------
router.post("/creteTrends", createTrendsController);
router.get(
  "/getProductsForTrendBuilding",
  getProductsForTrendBuildingController,
);
router.get("/getTrendsForDashboard", getTrendsForDashboardController);
router.delete("/deleteTrends", deleteTrendsFromDashboardController);
router.put("/editTrends", editTrendsController);
//-----------------------------------------------------------------------------

//--------------- order managements api's --------------------------------------
router.get(
  "/getUpcomingOrderDetailsforDashboard",
  getUpcomingOrderDetailsforDashboardController,
);
router.post(
  "/updateOrderStatusInOrderPage",
  updateOrderStatusInOrderPageController,
);
//------------------------------------------------------------------------------

// ---------- Dashboard API's ---------------
router.get("/getOrderStatsForDashboard", getOrderStatsForDashboardController);
router.get("/getGraphsStatsForDashboard", getGraphsStatsForDashboardController);

export default router;

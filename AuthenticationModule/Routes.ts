import { Router } from "express";
import {
  // verifyOtpController,
  sendOtpController,
  registerUserController,
  loginUserController,
  verifyMeController,
} from "./Controllers/Auth.Controller";
import { ShopDetailUploads } from "../Middleware/Multer/ShopResources";
import { verifyFirebaseToken } from "../Config/FirebaseAuthebtication/auth.middleware";

const router = Router();

// router.post("/verify-otp", verifyOtpController);

router.post("/send-otp", sendOtpController);

router.post(
  "/registerUser",
  ShopDetailUploads.fields([
    {
      name: "shopPhotos",
      maxCount: 2,
    },
  ]),
  registerUserController,
);

//----------------------------------------------

router.post("/loginUser", verifyFirebaseToken, loginUserController);

router.get("/verifyme", verifyMeController);

export default router;

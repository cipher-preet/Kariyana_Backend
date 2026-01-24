import { Router } from "express";
import {
  verifyOtpController,
  sendOtpController,
  registerUserController,
  loginUserController,
} from "./Controllers/Auth.Controller";
import { ShopDetailUploads } from "../Middleware/Multer/ShopResources";
import { verifyFirebaseToken } from "../Config/FirebaseAuthebtication/auth.middleware";

const router = Router();

router.post("/verify-otp", verifyOtpController);

router.post("/send-otp", sendOtpController);

router.post(
  "/registerUser",
  ShopDetailUploads.fields([
    {
      name: "aadhar",
      maxCount: 2,
    },
    {
      name: "pan",
      maxCount: 2,  
    },
    {
      name: "shopLicense",
      maxCount: 2,
    },
  ]),
  registerUserController
);

//----------------------------------------------

router.post("/loginUser", verifyFirebaseToken, loginUserController);

export default router;

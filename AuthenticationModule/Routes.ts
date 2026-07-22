import { Router } from "express";
import {
  verifyOtpController,
  sendOtpController,
  registerUserController,
  loginUserController,
  verifyMeController,
} from "./Controllers/Auth.Controller";
import { ShopDetailUploads } from "../Middleware/Multer/ShopResources";

const router = Router();

router.post("/send-otp", sendOtpController);
router.post("/verify-otp", verifyOtpController);

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

router.post("/loginUser", loginUserController);

router.get("/verifyme", verifyMeController);

export default router;

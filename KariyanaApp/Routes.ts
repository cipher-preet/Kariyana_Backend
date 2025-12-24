import { Router } from "express";
import { getProductsBycategoryIdController } from "./Controllers/Productapp.controller";

const router = Router();

router.get("/getProductsbycategoryid/:categoryId", getProductsBycategoryIdController);


export default router;

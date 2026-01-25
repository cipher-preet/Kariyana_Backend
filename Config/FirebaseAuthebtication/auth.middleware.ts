import { Request, Response, NextFunction } from "express";
import admin from "./firebaseAdmin";

export interface AuthRequest extends Request {
  user?: any;
}

export const verifyFirebaseToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    const decoded = await admin.auth().verifyIdToken(token);

    console.log("this is decoded token-------->>", decoded)

    req.user = {
      uid: decoded.uid,
      phone_number: decoded.phone_number,
    };
  
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

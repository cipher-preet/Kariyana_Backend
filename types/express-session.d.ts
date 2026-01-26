import "express-session";

declare module "express-session" {
  interface SessionData {
    user?: {
      _id: string;
      phone:number;
      firebaseUid: string;
      role?: string;
      status: "REGISTER" | "PENDING" | "REJECTED" | "APPROVED";
    };
  }
}

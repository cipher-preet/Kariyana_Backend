import "express-session";

declare module "express-session" {
  interface SessionData {
    user?: {
      _id: string;
      firebaseUid: string;
      role?: string;
      status: "REGISTER" | "PENDING" | "REJECTED" | "APPROVED";
    };
  }
}

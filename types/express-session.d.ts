import "express-session";

declare module "express-session" {
  interface SessionData {
    user?: {
      _id: string;
      phone: number;
      role?: string;
      status: "REGISTER" | "PENDING" | "REJECTED" | "APPROVED";
    };
  }
}

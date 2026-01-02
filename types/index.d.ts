import "express";

declare global {
  namespace Express {
    interface User {
      uid: string;
      phone_number: number;
    }

    interface Request {
      user?: User;
    }
  }
}

export {};

import { Request, Response, NextFunction } from "express";

export const requireSession = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  next();
};

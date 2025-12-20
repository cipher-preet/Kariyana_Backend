import { Response } from "express";

const SuccessResponse = (res: Response, status: number, data: Object) => {
  return res.status(status).json({ success: true, data });
};

export { SuccessResponse };

import { Response } from "express";

const ErrorResponse = (res: Response, status: number, msg: string) => {
  return res.status(status).json({ success: false, message: msg });
};

export { ErrorResponse };

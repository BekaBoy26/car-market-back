import { NextFunction, Request, Response } from "express";

export const errorHandler = () => {
  return async (error: any, req: Request, res: Response, next: NextFunction) => {
    if (error.status && error.message) {
      return res.status(error.status).json({
        message: error.message,
      });
    }

    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  };
};
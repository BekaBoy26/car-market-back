import { NextFunction, Request, Response } from "express";
import { getBrandsService } from "../services/brands.service";

export const getBrandsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {

    const result = await getBrandsService()

    res.status(200).json({
      message: "succesfully got brands",
      data: result
    })
  } catch (error: any) {
    next(error);
  }
};

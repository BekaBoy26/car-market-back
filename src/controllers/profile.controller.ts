import { NextFunction, Request, Response } from "express";
import { getProfileService } from "../services/profile.service";

export const getProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id
    const result = await getProfileService(userId)

    res.status(200).json({
      message: "succesfully got profile",
      data: result
    })
  } catch (error: any) {
    next(error);
  }
};

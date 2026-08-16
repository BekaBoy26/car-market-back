import { NextFunction, Request, Response } from "express";
import { authLoginService, authRegService } from "../services/auth.service";
import { uploadImage } from "../utils/cloudinary";

export const authRegisterController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const body = req.body;

    let avatar;

    if (req.file) {
      const image = await uploadImage(req.file.buffer);
      avatar = image.url;
    }

    const result = await authRegService({
      ...body,
      avatar,
    });

    res.status(201).json({
      message: "succesfully registered",
      user: result.user,
      token: result.token,
    });
  } catch (error: any) {
    next(error);
  }
};

export const authLoginController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const body = req.body;
    const result = await authLoginService(body);

    res.status(200).json({
      message: "succesfully loginned",
      user: result.user,
      token: result.token,
    });
  } catch (error: any) {
    next(error);
  }
};

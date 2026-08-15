import { NextFunction, Request, Response } from "express";
import { authLoginService, authRegService } from "../services/auth.service";

export const authRegisterController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const body = req.body
    const result = await authRegService({
      ...body,
      avatar: req.file?.filename
    })

    res.status(201).json({
      message: "succesfully registered",
      user: result.user,
      token: result.token
    })
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
    const body = req.body
    const result = await authLoginService(body)


    res.status(200).json({
      message: "succesfully loginned",
      user: result.user,
      token: result.token
    })
  } catch (error: any) {
    next(error);
  }
};

import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { apiErrors } from "../utils/apiError";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw apiErrors.unauthorized("Token is required");
    }

    const [type, token] = authHeader.split(" ");

    if (type !== "Bearer" || !token) {
      throw apiErrors.unauthorized("Invalid token");
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );

    if (typeof decoded === "string") {
      throw apiErrors.unauthorized("Invalid token");
    }

    req.user = {
      id: decoded.id as number,
      email: decoded.email as string,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(apiErrors.unauthorized("Token expired"));
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return next(apiErrors.unauthorized("Invalid token"));
    }

    next(error);
  }
};
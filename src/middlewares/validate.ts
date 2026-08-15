import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Ошибка валидации",
        errors: result.error.issues,
      });
    }

    req.body = result.data;

    next();
  };
};

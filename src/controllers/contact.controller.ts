import { Request, Response, NextFunction } from "express";
import { contactSellerService } from "../services/contact.service";

export const contactSellerController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { clientEmail, sellerEmail, message } = req.body;

    if (!clientEmail || !sellerEmail || !message?.trim()) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    await contactSellerService({
      clientEmail,
      sellerEmail,
      message,
    });

    res.status(200).json({
      message: "Message sent successfully",
    });
  } catch (error) {
    next(error);
  }
};
import { NextFunction, Request, Response } from "express";
import {
  createFavoriteService,
  deleteFavoriteService,
  getFavoritesService,
} from "../services/favorites.service";

export const postFavoriteController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const carId = +req.params.carId;
    const userId = req.user!.id;
    const result = await createFavoriteService(carId, userId);

    res.status(201).json({
      message: "succesfully created favorite",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

export const getFavoritesController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;
    const result = await getFavoritesService(userId);

    res.status(200).json({
      message: "succesfully got favorites",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

export const deleteFavoriteController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const carId = +req.params.carId;
    const userId = req.user!.id;
    const result = await deleteFavoriteService(carId, userId);

    res.status(200).json({
      message: "succesfully deleted from favorites",
      deleted: result,
    });
  } catch (error: any) {
    next(error);
  }
};

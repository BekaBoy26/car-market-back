import { NextFunction, Request, Response } from "express";
import {
  createCarService,
  deleteCarService,
  getCarsService,
  getMyCarsService,
  getOneCarService,
  updateCarService,
} from "../services/cars.service";

export const postCarController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;

    const body = req.body;
    const images = req.files
      ? (req.files as Express.Multer.File[]).map((file) => file.filename)
      : [];
    const result = await createCarService(
      {
        ...body,
        images,
      },
      userId,
    );

    res.status(201).json({
      message: "succesfully created",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

export const getCarsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      search,
      brandId,
      minPrice,
      maxPrice,
      maxMileage,
      minYear,
      maxYear,
      sort,
    } = req.query;

    const result = await getCarsService({
      search: typeof search === "string" ? search : undefined,

      brandId: typeof brandId === "string" ? Number(brandId) : undefined,

      minPrice: typeof minPrice === "string" ? Number(minPrice) : undefined,

      maxPrice: typeof maxPrice === "string" ? Number(maxPrice) : undefined,

      maxMileage:
        typeof maxMileage === "string" ? Number(maxMileage) : undefined,

      minYear: typeof minYear === "string" ? Number(minYear) : undefined,

      maxYear: typeof maxYear === "string" ? Number(maxYear) : undefined,

      sort: sort === "price_asc" || sort === "price_desc" ? sort : undefined,
    });

    res.status(200).json({
      message: "succesfully got cars",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

export const getMyCarsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;

    const result = await getMyCarsService(userId);

    res.status(200).json({
      message: "Successfully got my cars",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

export const getOneCarController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = +req.params.id;
    const result = await getOneCarService(id);

    res.status(200).json({
      message: "succesfully got one car",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};
export const deleteCarController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = +req.params.id;
    const userId = req.user!.id;
    const result = await deleteCarService(id, userId);

    res.status(200).json({
      message: "succesfully deleted",
      deleted: result,
    });
  } catch (error: any) {
    next(error);
  }
};
export const updateCarController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;
    const id = Number(req.params.id);

    const result = await updateCarService(
      id,
      req.body,
      userId,
      req.files as Express.Multer.File[],
    );

    res.status(200).json({
      message: "Successfully updated",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

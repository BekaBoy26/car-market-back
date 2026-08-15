declare module "express-serve-static-core" {
  interface Request {
    file?: Express.Multer.File;
    files?: Express.Multer.File[];
  }
}

export interface ILoginBody {
  email: string;
  password: string;
}

export interface IRegBody {
  name: string;
  email: string;
  password: string;
  avatar?: string | null;
}

export interface ICarsBody {
  brand_id: number;
  model: string;
  year: number;
  mileage?: number;
  price: number;
  description?: string;
  condition: "new" | "used";
  images?: string[];
  existingImages?: string;
}

export interface IProfileBody {
  name?: string;
  email?: string;
  password?: string;
}

export interface IGetCarsFilters {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  minMileage?: number;
  maxMileage?: number;
  minYear?: number;
  maxYear?: number;
  brandId?: number;
  sort?: "price_asc" | "price_desc";
}

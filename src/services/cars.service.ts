import { pool } from "../plugins/pg";
import { ICarsBody, IGetCarsFilters } from "../types/types";
import { apiErrors } from "../utils/apiError";
import fs from "fs/promises";
import path from "path";

export const createCarService = async (body: ICarsBody, userId: number) => {
  const {
    brand_id,
    condition,
    model,
    price,
    year,
    description,
    images,
    mileage,
  } = body;

  const brand = await pool.query("SELECT id FROM brands WHERE id = $1", [
    brand_id,
  ]);

  if (brand.rowCount === 0) {
    throw apiErrors.notFound("Неизвестный Бренд");
  }

  const result = await pool.query(
    `
    INSERT INTO cars(
      user_id,
      brand_id,
      model,
      year,
      mileage,
      price,
      description,
      condition
    )
    VALUES($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *
    `,
    [
      userId,
      brand_id,
      model,
      year,
      mileage ?? 0,
      price,
      description,
      condition,
    ],
  );

  const car = result.rows[0];

  if (images?.length) {
    for (const image of images) {
      await pool.query(
        `
        INSERT INTO car_images(
          car_id,
          image_path
        )
        VALUES($1,$2)
        `,
        [car.id, image],
      );
    }
  }

  return car;
};

export const getCarsService = async ({
  search,
  minPrice,
  maxPrice,
  maxMileage,
  minYear,
  maxYear,
  sort,
  brandId,
}: IGetCarsFilters = {}) => {
  const values: (string | number)[] = [];
  const conditions: string[] = [];

  if (search?.trim()) {
    values.push(`%${search.trim()}%`);
    conditions.push(`
      (
        brands.name ILIKE $${values.length}
        OR cars.model ILIKE $${values.length}
      )
    `);
  }

  if (brandId !== undefined) {
    values.push(brandId);
    conditions.push(`cars.brand_id = $${values.length}`);
  }

  if (minPrice !== undefined) {
    values.push(minPrice);
    conditions.push(`cars.price >= $${values.length}`);
  }

  if (maxPrice !== undefined) {
    values.push(maxPrice);
    conditions.push(`cars.price <= $${values.length}`);
  }

  if (maxMileage !== undefined) {
    values.push(maxMileage);
    conditions.push(`cars.mileage <= $${values.length}`);
  }

  if (minYear !== undefined) {
    values.push(minYear);
    conditions.push(`cars.year >= $${values.length}`);
  }

  if (maxYear !== undefined) {
    values.push(maxYear);
    conditions.push(`cars.year <= $${values.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  let orderBy = "cars.created_at DESC";

  if (sort === "price_asc") {
    orderBy = "cars.price ASC";
  }

  if (sort === "price_desc") {
    orderBy = "cars.price DESC";
  }

  const result = await pool.query(
    `
    SELECT 
      cars.id,
      cars.model,
      cars.year,
      cars.mileage,
      cars.price,
      cars.description,
      cars.condition,
      brands.name AS brand,
      COALESCE(
        ARRAY_AGG(car_images.image_path)
        FILTER (WHERE car_images.image_path IS NOT NULL),
        '{}'
      ) AS images
    FROM cars
    JOIN brands 
      ON brands.id = cars.brand_id
    LEFT JOIN car_images 
      ON car_images.car_id = cars.id

    ${where}

    GROUP BY cars.id, brands.name
    ORDER BY ${orderBy}
    `,
    values,
  );

  return result.rows;
};

export const getMyCarsService = async (userId: number) => {
  const result = await pool.query(
    `
      SELECT
        cars.id,
        cars.model,
        cars.year,
        cars.mileage,
        cars.price,
        cars.description,
        cars.condition,
        brands.name AS brand,
        COALESCE(
          ARRAY_AGG(car_images.image_path)
          FILTER (WHERE car_images.image_path IS NOT NULL),
          '{}'
        ) AS images
      FROM cars
      JOIN brands
        ON brands.id = cars.brand_id
      LEFT JOIN car_images
        ON car_images.car_id = cars.id
      WHERE cars.user_id = $1
      GROUP BY cars.id, brands.name
      ORDER BY cars.created_at DESC
    `,
    [userId],
  );

  return result.rows;
};

export const getOneCarService = async (id: number) => {
  const result = await pool.query(
    `
    SELECT
      cars.id,
      cars.model,
      cars.year,
      cars.mileage,
      cars.price,
      cars.description,
      cars.condition,
      brands.name AS brand,
      users.name AS owner,
      user_avatars.image_path AS "ownerAvatar",
      users.email AS "ownerEmail",

      COALESCE(
        ARRAY_AGG(DISTINCT car_images.image_path)
        FILTER (WHERE car_images.image_path IS NOT NULL),
        '{}'
      ) AS images

    FROM cars

    JOIN brands
      ON brands.id = cars.brand_id

    JOIN users
      ON users.id = cars.user_id

    LEFT JOIN user_avatars
      ON user_avatars.user_id = users.id

    LEFT JOIN car_images
      ON car_images.car_id = cars.id

    WHERE cars.id = $1

    GROUP BY
      cars.id,
      brands.name,
      users.name,
      users.email,
      user_avatars.image_path
    `,
    [id],
  );

  const car = result.rows[0];

  if (!car) {
    throw apiErrors.notFound("Car not found");
  }

  return car;
};

export const deleteCarService = async (id: number, userId: number) => {
  const result = await pool.query(
    `
      DELETE FROM cars
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `,
    [id, userId],
  );

  if (!result.rows[0]) {
    throw apiErrors.notFound("Car not found");
  }

  return {
    message: "Car deleted successfully",
  };
};

export const updateCarService = async (
  id: number,
  body: ICarsBody,
  userId: number,
  files: Express.Multer.File[] = [],
) => {
  const {
    brand_id,
    model,
    year,
    mileage,
    price,
    description,
    condition,
    existingImages,
  } = body;

  const result = await pool.query(
    `
      UPDATE cars
      SET
        brand_id = COALESCE($1, brand_id),
        model = COALESCE($2, model),
        year = $3,
        mileage = $4,
        price = $5,
        description = $6,
        condition = $7,
        updated_at = NOW()
      WHERE id = $8 AND user_id = $9
      RETURNING *
    `,
    [brand_id, model, year, mileage, price, description, condition, id, userId],
  );

  const car = result.rows[0];

  if (!car) {
    throw apiErrors.notFound("Car not found");
  }

  let keptImages: string[] = [];

  if (existingImages) {
    try {
      keptImages = JSON.parse(existingImages);
    } catch {
      keptImages = [];
    }
  }

  const currentImages = await pool.query(
    `
      SELECT id, image_path
      FROM car_images
      WHERE car_id = $1
    `,
    [id],
  );

  for (const image of currentImages.rows) {
    if (!keptImages.includes(image.image_path)) {
      await pool.query(
        `
          DELETE FROM car_images
          WHERE id = $1
        `,
        [image.id],
      );

      const filePath = path.join(
        process.cwd(),
        "src",
        "uploads",
        image.image_path,
      );

      try {
        await fs.unlink(filePath);
      } catch {
        // Ignore missing files.
      }
    }
  }

  for (const file of files) {
    await pool.query(
      `
        INSERT INTO car_images (
          car_id,
          image_path
        )
        VALUES ($1, $2)
      `,
      [id, file.filename],
    );
  }

  const imagesResult = await pool.query(
    `
      SELECT image_path
      FROM car_images
      WHERE car_id = $1
      ORDER BY id
    `,
    [id],
  );

  return {
    ...car,
    images: imagesResult.rows.map((image) => image.image_path),
  };
};

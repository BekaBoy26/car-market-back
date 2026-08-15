import { pool } from "../plugins/pg";
import { apiErrors } from "../utils/apiError";

export const createFavoriteService = async (carId: number, userId: number) => {
  const favorite = await pool.query(
    `SELECT 1
   FROM favorites
   WHERE user_id = $1 AND car_id = $2`,
    [userId, carId],
  );

  if (favorite.rowCount! > 0) {
    throw apiErrors.conflict("Машина уже в избранных");
  }

  const result = await pool.query(
    `
      INSERT INTO favorites(
        user_id,
        car_id
      )
      VALUES($1, $2)
      RETURNING *
    `,
    [userId, carId],
  );

  return result.rows[0];
};

export const getFavoritesService = async (userId: number) => {
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
      FROM favorites
      JOIN cars
        ON cars.id = favorites.car_id
      JOIN brands
        ON brands.id = cars.brand_id
      LEFT JOIN car_images
        ON car_images.car_id = cars.id
      WHERE favorites.user_id = $1
      GROUP BY
        cars.id,
        cars.model,
        cars.year,
        cars.mileage,
        cars.price,
        cars.description,
        cars.condition,
        brands.name,
        favorites.created_at
      ORDER BY favorites.created_at DESC
    `,
    [userId],
  );

  return result.rows;
};

export const deleteFavoriteService = async (carId: number, userId: number) => {
  const result = await pool.query(
    `
        delete from favorites
        where car_id = $1 and user_id = $2
        returning *
        `,
    [carId, userId],
  );

  if (!result.rows[0]) {
    throw apiErrors.notFound("Favorite not found");
  }

  return result.rows[0];
};

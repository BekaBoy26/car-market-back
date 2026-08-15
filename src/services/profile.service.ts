import { pool } from "../plugins/pg";
import { IProfileBody } from "../types/types";
import { apiErrors } from "../utils/apiError";
import bcrypt from "bcrypt";

export const getProfileService = async (userId: number) => {
  const result = await pool.query(
    `
      SELECT
        users.id,
        users.name,
        users.email,
        users.created_at,
        user_avatars.image_path AS avatar
      FROM users
      LEFT JOIN user_avatars
        ON user_avatars.user_id = users.id
      WHERE users.id = $1
    `,
    [userId],
  );

  const user = result.rows[0];

  if (!user) {
    throw apiErrors.notFound("User not found");
  }

  return user;
};
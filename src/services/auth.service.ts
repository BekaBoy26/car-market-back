import bcrypt from "bcrypt";
import { pool } from "../plugins/pg";
import { ILoginBody, IRegBody } from "../types/types";
import { generateToken } from "../utils/generateToken";
import { apiErrors } from "../utils/apiError";

export const authRegService = async (body: IRegBody) => {
  const { avatar, email, name, password } = body;
  const hashed = await bcrypt.hash(password, 10);

  const testUser = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  if (testUser.rows.length > 0) {
    throw apiErrors.conflict("Email already exists");
  }

  const result = await pool.query(
    `
            insert into users(name, email, password_hash)
            values($1, $2, $3)
            returning id
        `,
    [name, email, hashed],
  );

  const user = result.rows[0];

  if (avatar) {
    await pool.query(
      `
                insert into user_avatars(user_id, image_path)
                values($1, $2)
            `,
      [user.id, avatar],
    );
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
  });

  return {
    user,
    token,
  };
};

export const authLoginService = async (body: ILoginBody) => {
  const { email, password } = body;

  const result = await pool.query(
    `
            select * from users where email = $1
        `,
    [email],
  );

  const user = result.rows[0];

  if (!user) throw apiErrors.unauthorized("Invalid email");

  const isMatchedPass = await bcrypt.compare(password, user.password_hash);

  if (!isMatchedPass) throw apiErrors.unauthorized("Invalid password");

  const token = generateToken({
    id: user.id,
    email: user.email,
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token,
  };
};

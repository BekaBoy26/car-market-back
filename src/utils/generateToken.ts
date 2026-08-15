import jwt from "jsonwebtoken";

interface ITokenPayload {
  id: number;
  email: string;
}

export const generateToken = (payload: ITokenPayload) => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET as string,
    {
      expiresIn: "1h",
    }
  );
};
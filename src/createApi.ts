import cors from "cors";
import express from "express";
import { logger } from "./middlewares/logger";
import { pool } from "./plugins/pg";
import { errorHandler } from "./middlewares/errorHandler";
import authRouter from "./routes/auth.route";
import carsRouter from "./routes/cars.route";
import favoritesRouter from "./routes/favorites.route";
import profileRouter from "./routes/profile.route";
import brandsRouter from "./routes/brands.route";
import contactRouter from "./routes/contact.route";

const createApi = async () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use("/uploads", express.static("src/uploads"));
  app.use(logger);

  app.use("/auth", authRouter);
  app.use("/brands", brandsRouter);
  app.use("/cars", carsRouter);
  app.use("/favorites", favoritesRouter);
  app.use("/profile", profileRouter);
  app.use("/contact-seller", contactRouter);

  app.use(errorHandler());
  await pool.query("SELECT 1");
  console.log("DB Connected");
  return app;
};

export default createApi;

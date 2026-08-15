import multer, { diskStorage } from "multer";
import path from "path";
import { randomUUID } from "crypto";

const storage = diskStorage({
  destination: (_, __, cb) => {
    cb(null, "src/uploads");
  },

  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);

    cb(null, `${randomUUID()}${ext}`);
  },
});

export const uploadMiddleware = multer({
  storage,

  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

import express from "express";
import type { Request, Response } from "express";
import authRoutes from "./api/routes/auth.routes.js";
import productRoutes from "./api/routes/product.routes.js";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

//upload file
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "berbenih/products",
      format: "jpeg",
      public_id: file.fieldname + "-" + Date.now(),
    };
  },
});

const upload = multer({ storage: storage });

// Hello backend
app.get("/", (req: Request, res: Response) => {
  res.send("Hello backend");
});

//Filtering route
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// Post image
app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.json({
    message: "Upload success",
    url: req.file.path,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

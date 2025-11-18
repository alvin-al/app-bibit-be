import express from "express";
import type { Request, Response } from "express";
import authRoutes from "./api/routes/auth.routes.js";
import productRoutes from "./api/routes/product.routes.js";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import path from "path";

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

app.get("/", (req: Request, res: Response) => {
  res.send("Hello backend");
});

//upload file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

//Filtering route
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

//upload route
app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Tidak ada file yang diupload" });
  }

  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`;

  res.json({ message: "Upload berhasil", url: fileUrl });
});
app.use("/uploads", express.static(path.join(process.cwd(), "public/uploads")));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

import express from "express";
import type { Request, Response } from "express";
import authRoutes from "./api/routes/auth.routes.js";
import productRoutes from "./api/routes/product.routes.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello backend");
});

//Filtering route
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

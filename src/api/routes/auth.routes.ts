import type { Request, Response } from "express";
import { Router } from "express";
import dotenv from "dotenv";
import { loginUser, registerUser } from "../controllers/auth.controller.js";

dotenv.config();
const router: ReturnType<typeof Router> = Router();

//GET Test
router.get("/test", (req: Request, res: Response) => {
  res.send("Auth router OK");
});

//Register & login
router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;

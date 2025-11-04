import type { Request, Response } from "express";
import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma.js";

const router: ReturnType<typeof Router> = Router();

//GET Test
router.get("/test", (req: Request, res: Response) => {
  res.send("Auth router OK");
});

//POST Register
router.post("/register", async (req: Request, res: Response) => {
  try {
    //validation
    const registerSchema = z.object({
      email: z.email("Email tidak valid"),
      password: z.string().min(8, "password minimal 8 karakter"),
    });

    const { email, password } = registerSchema.parse(req.body);

    //check duplicate email
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return res.status(409).json({ message: "Email sudah terdaftar" });
    }

    //hash password
    const passwordHash = await bcrypt.hash(password, 10);

    //save user to DB
    const newUser = await prisma.user.create({
      data: {
        email: email,
        passwordHash: passwordHash,
        name: "",
      },
    });

    //return success to frontend
    res.status(201).json({
      message: "User berhasil dibuat",
      user: {
        id: newUser.id,
        email: newUser.email,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    //send input error
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Input tidak valid",
        errors: error,
      });
    }

    console.error("Error saat register: ", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

export default router;

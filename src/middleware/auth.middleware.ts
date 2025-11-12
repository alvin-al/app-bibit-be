import type { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";

// ✅ Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
      };
    }
  }
}

interface JwtPayload {
  userId: string;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    //Check header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Akses ditolak: Token tidak ada format atau salah" });
    }

    //Get token
    const token = authHeader.split(" ")[1];

    //Get secret key
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      console.error("JWT_SECRET tidak ditemukan di environment variables");
      return res.status(500).json({ message: "Kesalahan konfigurasi server" });
    }

    //token verification
    const payload = jwt.verify(token, secretKey) as JwtPayload;

    //send user data to req
    req.user = { userId: payload.userId };

    //go to next page
    next();
  } catch (error) {
    //catch all error
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Token tidak valid" });
    }
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Token sudah kadaluarsa" });
    }
    //catch error server
    console.error("Error di auth middleware: ", error);
    return res.status(500).json({ message: "Kesalahan server internal" });
  }
};

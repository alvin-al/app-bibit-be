import type { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
}

interface authMiddlewareType {
  req: Request;
  res: Response;
  next: NextFunction;
}

export const authMiddleware = ({ req, res, next }: authMiddlewareType) => {
  try {
    const authHeader = req.headers.authorization;

    //Check header
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res
        .status(401)
        .json({ message: "Akses ditolak: Token tidak ada format atau salah" });
    }

    //Get token
    const token = authHeader.split(" ")[1];

    //Get secret key
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      throw new Error("No JWT secret key");
    }

    //token verification
    const payload = jwt.verify(token!, secretKey) as unknown as JwtPayload;

    //send user data to req
    req.user = { userId: payload.userId };

    //go to next page

    next();
  } catch (error) {
    //catch all error
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Token tidak valid" });
    }
    //catch error server
    console.error("Error di auth middleware: ", error);
    return res.status(500).json({ message: "Kesalahan server internal" });
  }
};

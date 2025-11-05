import type { NextFunction, Response, Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

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
    const token = authHeader.split("")[1];

    //Get secret key
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      throw new Error("No JWT secret key");
    }

    //token verification
    const payload = jwt.verify(token, secretKey) as JwtPayload;

    //send user data to req
    //go to next page
  } catch (error) {
    //catch all error
    //catch error server
  }
};

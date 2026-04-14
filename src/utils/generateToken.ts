import jwt from "jsonwebtoken";
import { type Response } from "express";

const jwt_secret = process.env.JWT_SECRET as string;
const jwt_expires_in = process.env.JWT_EXPIRES_IN as any;

export const generateToken = (userId: string, res: Response): string => {
  const payLoad = { id: userId };
  const token = jwt.sign(payLoad, jwt_secret, {
    expiresIn: jwt_expires_in || "7d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
  return token;
};

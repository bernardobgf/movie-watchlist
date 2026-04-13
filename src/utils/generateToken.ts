import jwt from "jsonwebtoken";

const jwt_secret = process.env.JWT_SECRET as string;
const jwt_expires_in = process.env.JWT_EXPIRES_IN as any;

export const generateToken = (userId: string): string => {
  const payLoad = { id: userId };
  const token = jwt.sign(payLoad, jwt_secret, {
    expiresIn: jwt_expires_in || "7d",
  });

  return token;
};

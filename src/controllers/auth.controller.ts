import { type Request, type Response } from "express";
import { prisma } from "../db";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken";

type RegisterBody = {
  name: string;
  email: string;
  password: string;
};

type LoginBody = Pick<RegisterBody, "email" | "password">;

export const register = async (
  req: Request<{}, {}, RegisterBody>,
  res: Response,
) => {
  const { name, email, password } = req.body;

  const userExists = await prisma.user.findUnique({
    where: { email: email },
  });

  if (userExists) {
    return res
      .status(400)
      .json({ error: "User already exists with this email" });
  }

  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  //generate token
  const token = generateToken(user.id, res);

  return res.status(201).json({
    status: "sucess",
    data: {
      user: {
        id: user.id,
        name: name,
        email: email,
      },
      token,
    },
  });
};

export const login = async (req: Request<{}, {}, LoginBody>, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  //VERIFY PASSWORD
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  //generate token
  const token = generateToken(user.id, res);

  return res.status(200).json({
    status: "sucess",
    data: {
      user: {
        id: user.id,
        email: email,
      },
      token,
    },
  });
};

export const logout = async (req: Request, res: Response) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({
    status: "sucess",
    message: "logged out sucessfuly",
  });
};

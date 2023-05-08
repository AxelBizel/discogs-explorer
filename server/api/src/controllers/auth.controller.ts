import jwt from "jsonwebtoken";
import config from "../config/auth.config.js";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import prisma from "../../../prisma/prisma.js";
import { v4 as uuidv4 } from "uuid";

const signup = async (req: Request, res: Response) => {
  await prisma.users
    .create({
      data: {
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
      },
    })
    .then(() => {
      res.send({ message: "User was registered successfully!" });
    })
    .catch((err: { message: string }) => {
      res.status(500).send({ message: err.message });
    });
};

interface LoginRequestBody {
  username: string;
  password: string;
}

const login = async (req: Request<{}, {}, LoginRequestBody>, res: Response) => {
  const user = await prisma.users.findUnique({
    where: { username: req.body.username as string },
  });

  if (!user) {
    return res.status(404).send({ message: "User Not found." });
  }
  const passwordIsValid = bcrypt.compareSync(
    req.body.password,
    user?.password || ""
  );

  if (!passwordIsValid) {
    return res.status(401).send({
      accessToken: null,
      message: "Invalid Password!",
    });
  }

  const token = jwt.sign({ id: user.id }, config.secret, {
    expiresIn: config.jwtExpiration,
  });

  // Handle refreshToken
  let expiryDate = new Date();
  expiryDate.setSeconds(expiryDate.getSeconds() + config.jwtRefreshExpiration);
  let _token = uuidv4();
  const newRefreshToken = await prisma.refreshTokens.create({
    data: {
      token: _token,
      userId: user.id,
      expiryDate: expiryDate,
    },
  });

  res.status(200).send({
    id: user.id,
    username: user.username,
    email: user.email,
    accessToken: token,
    refreshToken: newRefreshToken.token,
  });
};

const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken: requestToken } = req.body;

  if (requestToken == null) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }

  try {
    const refreshToken = await prisma.refreshTokens.findUnique({
      where: { token: requestToken },
    });

    // Check if refresh token exists
    if (!refreshToken) {
      res.status(403).json({ message: "Refresh token is not in database!" });
      return;
    }

    // Check if refresh token is still valid
    const expiryDate = refreshToken.expiryDate?.getTime();
    if ((expiryDate as number) < new Date().getTime()) {
      prisma.refreshTokens.delete({ where: { id: refreshToken.id } });
      res.status(403).json({
        message: "Refresh token was expired. Please make a new login request",
      });
      return;
    }

    // Check if refresh token belongs to valid user
    const user = await prisma.users.findUnique({
      where: { id: refreshToken.userId as number },
    });
    if (!user) {
      prisma.refreshTokens.delete({ where: { id: refreshToken.id } });
      res.status(403).json({
        message: "Refresh token belongs to no valid user",
      });
      return;
    }

    // Generate new access token
    let newAccessToken = jwt.sign({ id: user.id as number }, config.secret, {
      expiresIn: config.jwtExpiration,
    });

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};

export default { signup, login, refreshToken };

import { Request, Response, NextFunction } from "express";
import fetch from "node-fetch";
import prisma from "../../prisma/prisma.js";

const discogsEndpoint = "https://api.discogs.com/users/";

const verifySignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Check if username exists in discogs
  const discogsReq = await fetch(`${discogsEndpoint}${req.body.username}`);
  const discogsRes: any = await discogsReq.json();
  if (!discogsRes.id) {
    res.status(400).send({
      message: "Failed! Username does not exist on Discogs",
    });
    return;
  }

  // Username
  const user = await prisma.users.findUnique({
    where: {
      username: req.body.username,
    },
  });
  if (user) {
    res.status(400).send({
      message: "Failed! Username is already in use!",
    });
    return;
  }

  // Email
  const email = await prisma.users.findUnique({
    where: {
      username: req.body.email,
    },
  });

  if (email) {
    res.status(400).send({
      message: "Failed! Email is already in use!",
    });
    return;
  }

  next();
};

export default verifySignUp;

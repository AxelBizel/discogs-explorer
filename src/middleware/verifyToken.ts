import jwt from "jsonwebtoken";
import config from "../config/auth.config.js";
import { IncomingHttpHeaders } from "http";
import { Request, Response, NextFunction } from "express";

const { TokenExpiredError, JsonWebTokenError } = jwt;

interface AuthenticatedRequest extends Request {
  headers: IncomingHttpHeaders;
  user: { id: number };
}

const catchError = (err: any, res: Response) => {
  if (err instanceof TokenExpiredError) {
    return res
      .status(401)
      .send({ message: "Unauthorized! Access Token was expired!" });
  }

  return res.sendStatus(401).send({ message: "Unauthorized!" });
};

const verifyToken = (req: any, res: Response, next: NextFunction) => {
  let token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }

  jwt.verify(token, config.secret as string, (err: any, decoded: any) => {
    if (err) {
      res.status(401).json({ message: "Authentication failed" });
    } else {
      req.user = decoded as { id: number };
      next();
    }
  });
};

export default verifyToken;

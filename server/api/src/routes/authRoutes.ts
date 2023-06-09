import verifySignUp from "../middleware/verifySignup.js";
import controller from "../controllers/auth.controller.js";
import express, { Request, Response, NextFunction } from "express";

export default (app: express.Application) => {
  app.use(function (_req: Request, res: Response, next: NextFunction) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/auth/signup", verifySignUp, controller.signup);
  app.post("/api/auth/login", controller.login);
  app.post("/api/auth/refreshtoken", controller.refreshToken);
};

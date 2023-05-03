import controller from "../controllers/discogs.controller.js";
import verifyToken from "../middleware/verifyToken.js";
import express, { Request, Response, NextFunction } from "express";

export default function (app: express.Application) {
  app.use(function (req: Request, res: Response, next: NextFunction) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/fetch-collection", verifyToken, controller.fetchCollection);
  app.post("/api/collection", verifyToken, controller.getCollection);
  app.post("/api/collection-by-year", verifyToken, controller.getCollectionByYear);
}

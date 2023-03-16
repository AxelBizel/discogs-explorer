import controller from "../controllers/discogs.controller.js";
import verifyToken from "../middleware/verifyToken.js";

export default function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/fetch-collection", verifyToken, controller.getCollection);
}

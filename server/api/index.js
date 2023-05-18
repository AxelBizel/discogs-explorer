import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import authRoutes from "./src/routes/authRoutes.js";
import discogsRoutes from "./src/routes/discogs.routes.js";

const app = express();

app.use(cors());

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/api", (req, res) => {
  res.json({ message: "Welcome to discogs V2 app." });
});

// routes
authRoutes(app);
discogsRoutes(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

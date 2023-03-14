import db from "../models/index.js";
import fetch from "node-fetch";

const User = db.user;
const discogsEndpoint = "https://api.discogs.com/users/";

const verifySignUp = async (req, res, next) => {
  // Check if username exists in discogs
  const discogsReq = await fetch(`${discogsEndpoint}${req.body.username}`);
  const discogsRes = await discogsReq.json();
  if (!discogsRes.id) {
    res.status(400).send({
      message: "Failed! Username does not exist on Discogs",
    });
    return;
  }

  // Username
  User.findOne({
    where: {
      username: req.body.username,
    },
  }).then((user) => {
    if (user) {
      res.status(400).send({
        message: "Failed! Username is already in use!",
      });
      return;
    }

    // Email
    User.findOne({
      where: {
        email: req.body.email,
      },
    }).then((user) => {
      if (user) {
        res.status(400).send({
          message: "Failed! Email is already in use!",
        });
        return;
      }

      next();
    });
  });
};

export default verifySignUp;

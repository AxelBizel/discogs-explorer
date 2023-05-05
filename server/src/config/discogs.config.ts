export default {
  method: "oauth",
  level: 2,
  consumerKey: process.env.DISCOGS_CONSUMER_KEY,
  consumerSecret: process.env.DISCOGS_CONSUMER_SECRET,
  token: process.env.DISCOGS_TOKEN,
  tokenSecret: process.env.DISCOGS_TOKEN_SECRET,
};

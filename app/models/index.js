import config from "../config/db.config.js";
import Sequelize from "sequelize";
import user from "./user.model.js";
import refreshToken from "./refreshToken.model.js";
import release from "./release.model.js";
import artist from "./artist.model.js";
import label from "./label.model.js";
import genre from "./genre.model.js";
import style from "./style.model.js";

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = user(sequelize, Sequelize);
db.refreshToken = refreshToken(sequelize, Sequelize);
db.release = release(sequelize, Sequelize);
db.artist = artist(sequelize, Sequelize);
db.label = label(sequelize, Sequelize);
db.genre = genre(sequelize, Sequelize);
db.style = style(sequelize, Sequelize);

// Many to many relations handling
export const Artists_Releases = sequelize.define(
  "artists_releases",
  {},
  {
    timestamps: false,
  }
);
export const Genres_Releases = sequelize.define(
  "genres_releases",
  {},
  {
    timestamps: false,
  }
);
export const Labels_Releases = sequelize.define(
  "labels_releases",
  {},
  {
    timestamps: false,
  }
);
export const Styles_Releases = sequelize.define(
  "styles_releases",
  {},
  {
    timestamps: false,
  }
);

db.refreshToken.belongsTo(db.user, {
  foreignKey: "userId",
  targetKey: "id",
});
db.user.hasOne(db.refreshToken, {
  foreignKey: "userId",
  targetKey: "id",
});
db.release.belongsTo(db.user, {
  foreignKey: "userId",
  targetKey: "id",
});
db.user.hasMany(db.release, {
  foreignKey: "userId",
  targetKey: "id",
});
db.release.belongsToMany(db.artist, {
  through: Artists_Releases,
  foreignKey: "releaseId",
  otherKey: "artistId",
});
db.artist.belongsToMany(db.release, {
  through: Artists_Releases,
  foreignKey: "artistId",
  otherKey: "releaseId",
});
db.release.belongsToMany(db.label, {
  through: Labels_Releases,
  foreignKey: "releaseId",
  otherKey: "labelId",
});
db.label.belongsToMany(db.release, {
  through: Labels_Releases,
  foreignKey: "labelId",
  otherKey: "releaseId",
});
db.release.belongsToMany(db.genre, {
  through: Genres_Releases,
  foreignKey: "releaseId",
  otherKey: "genreId",
});
db.genre.belongsToMany(db.release, {
  through: Genres_Releases,
  foreignKey: "genreId",
  otherKey: "releaseId",
});
db.release.belongsToMany(db.style, {
  through: Styles_Releases,
  foreignKey: "releaseId",
  otherKey: "styleId",
});
db.style.belongsToMany(db.release, {
  through: Styles_Releases,
  foreignKey: "styleId",
  otherKey: "releaseId",
});

export default db;

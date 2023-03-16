export default (sequelize, Sequelize) => {
  const Artist = sequelize.define("artists", {
    discogsId: {
      type: Sequelize.INTEGER,
      unique: true,
    },
    name: {
      type: Sequelize.STRING,
    },
    resource_url: {
      type: Sequelize.STRING,
    },
  });

  return Artist;
};

export default (sequelize, Sequelize) => {
  const Release = sequelize.define("releases", {
    discogsId: {
      type: Sequelize.INTEGER,
    },
    dateAdded: {
      type: Sequelize.DATE,
    },
    title: {
      type: Sequelize.STRING,
    },
    resource_url: {
      type: Sequelize.STRING,
    },
    cover_url: {
      type: Sequelize.STRING,
    },
    cover_thumbnail: {
      type: Sequelize.STRING,
    },
    release_year: {
      type: Sequelize.INTEGER,
    },
    master_release_year: {
      type: Sequelize.INTEGER,
    },
    master_id: {
      type: Sequelize.INTEGER,
    },
    master_url: {
      type: Sequelize.STRING,
    },
  });

  return Release;
};

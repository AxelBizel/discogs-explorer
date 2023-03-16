export default (sequelize, Sequelize) => {
  const Label = sequelize.define("labels", {
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

  return Label;
};

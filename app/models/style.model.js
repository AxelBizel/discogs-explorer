export default (sequelize, Sequelize) => {
  const Style = sequelize.define("styles", {
    name: {
      type: Sequelize.STRING,
      unique: true,
    },
  });
  return Style;
};

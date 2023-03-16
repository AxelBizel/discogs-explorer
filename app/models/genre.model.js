export default (sequelize, Sequelize) => {
  const Genre = sequelize.define("genres", {
    name: {
      type: Sequelize.STRING,
      unique: true,
    },
  });
  return Genre;
};

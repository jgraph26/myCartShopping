const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Tag = sequelize.define("Tag", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });

  Tag.associate = (models) => {
    Tag.belongsToMany(models.Product, { through: "productTags" });
  };

  return Tag;
};

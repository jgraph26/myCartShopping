import { DataTypes } from "sequelize";

const tag = (sequelize) => {
  const Tag = sequelize.define(
    "Tag",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    { timestamps: false }
  );

  Tag.associate = (models) => {
    Tag.belongsToMany(models.Product, { through: "productTags" });
  };

  return Tag;
};

export default tag;

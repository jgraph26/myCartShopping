const { DataTypes } = require("sequelize");
const { toDefaultValue } = require("sequelize/lib/utils");

module.exports = (sequelize) => {
  const Product = sequelize.define(
    "Product",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: { min: 0 },
      },

      sku: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      condition: {
        type: DataTypes.ENUM("new", "used"),
        allowNull: false,
      },
      brand: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { timestamps: true }
  );

  return Product;
};

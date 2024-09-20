import { DataTypes } from "sequelize";

const product = (sequelize) => {
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
      color: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      size: {
        type: DataTypes.STRING,
        allowNull: true,
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
    {
      indexes: [
        {
          fields: ["price"],
          unique: false,
        },
      ],
    },
    { timestamps: true }
  );

  Product.associate = (models) => {
    Product.belongsToMany(models.Tag, { through: "productTags" });
  };

  return Product;
};

export default product;

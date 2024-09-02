const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Cart = sequelize.define(
    "Cart",
    {
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },

    {
      timestamps: true,
    }
  );

  Cart.associate = (models) => {
    Cart.belongsTo(models.Product, {
      foreignKey: "productId",
      as: "product",
    });
  };

  return Cart;
};

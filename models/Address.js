import { DataTypes, Sequelize } from "sequelize";

const Address = (sequelize) => {
  const Address = sequelize.define(
    "Address",
    {
      full_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      address_line1: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      address_line2: {
        type: DataTypes.STRING,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      state: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      zip_code: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      phone: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { timestamps: false },

  );

  return Address;
};

export default Address;

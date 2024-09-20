import { DataTypes } from "sequelize";

const user = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      full_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },

      user_name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      // addressId: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      // },
      role: {
        type: DataTypes.ENUM(["client", "admin"]),
        defaultValue: "client",
      },
    },
    { timestamps: true }
  );


  // User.associate = (models) => {
  //   User.belongsTo(models.Address, {
  //     foreignKey: "addressId",
  //     as: "address",
  //   });
  // };

  return User;
};

export default user;

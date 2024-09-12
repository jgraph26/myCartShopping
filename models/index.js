import { Sequelize, DataTypes } from "sequelize";
import config from "../config/config.js";
const configDevelopment = config.development;
import Cart from "./cart.js";
import Product from "./Product.js";
import User from "./User.js";
import Tag from "./tag.js";

const sequelize = new Sequelize(
  configDevelopment.database,
  configDevelopment.username,
  configDevelopment.password,
  {
    host: configDevelopment.host,
    dialect: configDevelopment.dialect,
    timezone: "-04:00", // UTC
    logging: false,

    define: {
      timestamps: true,
    },
  }
);

const db = {
  sequelize,
  Sequelize,
  Cart: Cart(sequelize, DataTypes), // Llamada de la función importada
  Product: Product(sequelize, DataTypes),
  User: User(sequelize, DataTypes),
  Tag: Tag(sequelize, DataTypes),
};

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

export default db;

const { Sequelize, DataTypes } = require("sequelize");
const config = require("../config/config")["development"];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    logging: false,

    define: {
      timesTamp: false,
    },
  }
);

const db = {
  sequelize,
  Sequelize,
  Cart: require("./Cart")(sequelize, DataTypes),
  Product: require("./Product")(sequelize, DataTypes),
};

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;

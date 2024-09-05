const { Sequelize, DataTypes } = require("sequelize");
const config = require("../config/config")["development"];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    timezone: "-04:00", // UTC
    logging: false,

    define: {
      timestamps: false,
    },
  }
);

const db = {
  sequelize,
  Sequelize,
  Cart: require("./Cart")(sequelize, DataTypes),
  Product: require("./Product")(sequelize, DataTypes),
  User: require("./User")(sequelize, DataTypes),
  Tag: require("./tag")(sequelize, DataTypes),
};

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;

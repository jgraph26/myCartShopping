const morgan = require("morgan");
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const routers = require("./routes/routes");
const db = require("./models");
dotenv.config();

//middleWare
app.use(morgan("dev"));
app.use(express.json());
app.use("/Cart", routers);

//connection

db.sequelize
  .sync()
  .then(() => {
    app.set("port", process.env.PORT);
    app.listen(app.get("port"), () => {
      console.log(`conection sussesfull in port:${app.get("port")}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
  });

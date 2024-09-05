const morgan = require("morgan");
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const userRouters = require("./routes/loginRouter");
const adminRouter = require("./routes/adminRouter");
const CartRouter = require("./routes/cartRoutes");
const db = require("./models");

dotenv.config();

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use("/Cart", CartRouter);
app.use("/User", userRouters);
app.use("/admin", adminRouter);

// Connection
db.sequelize
  .sync({ force: false }) // Usa `force: false` para evitar eliminar tablas existentes
  .then(() => {
    const port = process.env.PORT;
    app.set("port", port);
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error.message);
  });

// db.sequelize
// .drop()
// .then(() => db.sequelize.sync({ force: true }))
// .then(() => console.log("Database synchronized"))
// .catch((error) => console.error("Error syncing database:", error.message));

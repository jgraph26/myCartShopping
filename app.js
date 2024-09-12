// const express = require("express");
import morgan from "morgan";
import express from "express";
const app = express();
import dotenv from "dotenv";
import userRouters from "./routes/loginRouter.js";
import adminRouter from "./routes/adminRouter.js";
import CartRouter from "./routes/cartRoutes.js";
import db from "./models/index.js";

dotenv.config();

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use("/Cart", CartRouter);
app.use("/User", userRouters);
app.use("/admin", adminRouter);

// Connection
db.sequelize
  .sync({ force: false }) // Uso `force: false` para evitar eliminar tablas existentes
  .then(() => {
    const port = process.env.PORT;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error.message);
  });

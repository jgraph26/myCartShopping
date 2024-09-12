import express from "express";
const router = express.Router();
import controllers from "../controllers/userControllers.js";

router.post("/register", controllers.registerSystem);

router.post("/login", controllers.login);

router.post("/changuePassword", controllers.changuePassword);

router.get("/clientFilterP", controllers.clientFilterProduct);

router.post("/changueUserName", controllers.changueUserName);

export default router;

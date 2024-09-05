const express = require("express");
const router = express.Router();
const controllers = require("../controllers/userControllers");

router.post("/register", controllers.registerSystem);

router.post("/login", controllers.login);

router.post("/changuePassword", controllers.changuePassword);

router.get("/clientFilterP", controllers.clientFilterProduct);

router.post("/changueUserName", controllers.changueUserName);

module.exports = router;

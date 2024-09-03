const express = require("express");
const router = express.Router();
const { isAdmin } = require("../middleware/adminMiddlewware");
const adminControllers = require("../controllers/adminControllers");

router.post("/addAdmin", isAdmin, adminControllers.addAdmin);

router.post("/addProduct", isAdmin, adminControllers.addProductToStock);

router.post("/deleteP", isAdmin, adminControllers.deleteProducts);

module.exports = router;

const express = require("express");
const router = express.Router();
const { isAdmin } = require("../middleware/adminMiddlewware");
const adminControllers = require("../controllers/adminControllers");

router.post("/addAdmin", isAdmin, adminControllers.addAdmin);

router.post("/addProduct", isAdmin, adminControllers.addProductToStock);

router.post("/deleteP", isAdmin, adminControllers.deleteProducts);

router.get("/showAllP", isAdmin, adminControllers.showAllProducts);

router.get("/filterP", isAdmin, adminControllers.adminFilterProduct);

module.exports = router;

import express from"express";
const router = express.Router();
import  isAdmin  from "../middleware/adminMiddlewware.js";
import adminControllers from"../controllers/adminControllers.js"

router.post("/addAdmin", isAdmin, adminControllers.addAdmin);

router.post("/addProduct", isAdmin, adminControllers.addProductToStock);

router.post("/deleteP", isAdmin, adminControllers.deleteProducts);

router.get("/showAllP", isAdmin, adminControllers.showAllProducts);

router.get("/filterP", isAdmin, adminControllers.adminFilterProduct);

export default router;

import express from "express"
const router = express.Router();
import controllers from "../controllers/CartControllers.js";

router.get("/show", controllers.show);

router.post("/add", controllers.insert);

router.delete("/delete/:productId", controllers.remove);

export default router;

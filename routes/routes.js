const express = require("express");
const router = express.Router();
const controllers = require("../controllers/controllers");

router.get("/show", controllers.show);

router.post("/add", controllers.insert);

router.delete("/delete/:productId", controllers.remove);

module.exports = router;

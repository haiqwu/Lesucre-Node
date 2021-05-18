const express = require("express");
const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

// controller
const { create } = require("../controllers/ProductOption");

// routes
router.post("/product-option", authCheck, adminCheck, create);
// router.get("/product-options", read);

module.exports = router;

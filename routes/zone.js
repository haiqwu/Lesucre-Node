const express = require("express");
const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

// controller
const {
  createZoneWithGBAndSD,
  listAll,
  getOne,
  updateZoneWithGBAndSD,
} = require("../controllers/zone");

// routes
router.post("/zone", authCheck, adminCheck, createZoneWithGBAndSD);

router.get("/zones", listAll);
router.get("/zone/:_id", getOne);

router.put("/zone/:_id", authCheck, adminCheck, updateZoneWithGBAndSD);

module.exports = router;

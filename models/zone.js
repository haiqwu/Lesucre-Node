const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const ZoneSchema = new mongoose.Schema(
  {
    zoneTitle: {
      type: String,
    },
    zoneState: {
      type: String,
    },
    zoneCity: {
      type: String,
    },
    zoneZipCode: {
      type: String,
    },
    groupBuy: {
      type: ObjectId,
      ref: "GroupBuy",
      required: true,
    },
    singleDelivery: {
      type: ObjectId,
      ref: "SingleDelivery",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Zone", ZoneSchema);

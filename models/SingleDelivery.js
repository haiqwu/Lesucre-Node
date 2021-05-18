const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const SingleDeliverySchema = new mongoose.Schema(
  {
    sdNote: {
      type: String,
    },
    sdDeliveryFee: {
      type: Number,
    },
    sdMinOrderTotal: {
      type: Number,
    },
    sdMinTipRate: {
      type: Number,
    },
    sdPayOnDelivery: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SingleDelivery", SingleDeliverySchema);

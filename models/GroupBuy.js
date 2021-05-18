const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const GroupBuySchema = new mongoose.Schema(
  {
    gbTitle: {
      type: String,
    },
    gbNote: {
      type: String,
    },
    gbDeliveryFee: {
      type: Number,
    },
    gbMinOrderTotal: {
      type: Number,
    },
    gbMinGroupBuyTotal: {
      type: Number,
    },
    expireDate: {
      type: Date,
    },
    deliveryDate: {
      type: Date,
    },
    orders: [{ type: String, ref: "Order" }],
    gbMinTipRate: {
      type: Number,
    },
    gbPayOnDelivery: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GroupBuy", GroupBuySchema);

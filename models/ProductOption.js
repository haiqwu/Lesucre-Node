const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const ProductOptionSchema = new mongoose.Schema(
  {
    opt_name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 128,
      text: true,
    },
    product: {
      type: String,
      ref: "Product",
      required: true,
    },
    default_opt: {
      type: Boolean,
    },

    // _id: String,

    price: {
      type: Number,
      required: true,
      trim: true,
      maxlength: 32,
    },
    quantity: Number,

    sold: {
      type: Number,
      default: 0,
    },

    // ratings: [
    //   {
    //     star: Number,
    //     postedBy: { type: ObjectId, ref: "User" },
    //   },
    // ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProductOption", ProductOptionSchema);

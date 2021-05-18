const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      maxlength: 128,
      text: true,
      unique: true,
    },

    _id: { type: String },
    description: {
      type: String,
      required: true,
      maxlength: 2048,
      text: true,
    },

    options: [{ type: ObjectId, ref: "ProductOption" }],
    // defaultOption: {
    //   type: ObjectId,
    //   ref: "ProductOption",
    // },

    category: {
      type: ObjectId,
      ref: "Category",
    },
    subs: [
      {
        type: ObjectId,
        ref: "Sub",
      },
    ],

    sold: {
      type: Number,
      default: 0,
    },
    images: {
      type: Array,
    },
    defaultImg: {
      public_id: String,
      url: String,
    },
    // shipping: {
    //   type: String,
    //   enum: ["Yes", "No"],
    //   default: "Yes",
    // },
    // color: {
    //   type: String,
    // },
    // brand: {
    //   type: String,
    // },
    // ratings: [
    //   {
    //     star: Number,
    //     postedBy: { type: ObjectId, ref: "User" },
    //   },
    // ],

    // slug: {
    //   type: String,
    //   unique: true,
    //   lowercase: true,
    //   index: true,
    // },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);

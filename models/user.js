const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const addressSchema = {
  full_name: String,
  street_address: { type: String },
  city: { type: String },
  state: String,
  postal_code: { type: String },
  country_code: { type: String },
};

const userSchema = new mongoose.Schema(
  {
    display_name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      index: true, // indexing the email field to make it more efficient when query
    },
    role: {
      type: String,
      default: "subscriber",
    },
    cart: {
      type: Array,
      default: [],
    },
    address: addressSchema,
    // wishlist: [{ type: ObjectId, ref: "Product" }],
    // history: [{ type: String, ref: "Order" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

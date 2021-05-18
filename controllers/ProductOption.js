const ProductOption = require("../models/ProductOption");
const Product = require("../models/product");

exports.create = async (req, res) => {
  try {
    console.log("In creating of ProdOpt ", req.body);

    const newProductOption = await new ProductOption(req.body).save();
    // Product handles:
    //DONE 2.2 add(push) to options list of the product
    await Product.findOneAndUpdate(
      { _id: req.body.product }, // search critieria (find by ...)
      {
        // defaultOption: newProductOption._id,
        $push: { options: newProductOption._id }, // 2.2
      },
      { new: true } // return the updated result
    );

    return res.json(newProductOption);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: "Create product-opt failed" });
  }
};

// exports.read = async (req, res) => {
//   let options = await ProductOption.find({});
//   return res.json(options);
// };

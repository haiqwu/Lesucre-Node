const Product = require("../models/product");
const { getNextSequence } = require("./sequence");
// const slugify = require("slugify");
const ProductOption = require("../models/ProductOption");
const Category = require("../models/category");
const Sub = require("../models/sub");

const logger = require("../config/winston-logger");

exports.create = async (req, res) => {
  try {
    console.log("create product:, body:", req.body);
    req.body._id = await getNextSequence("Product");
    const newProduct = await new Product(req.body).save();
    return res.json(newProduct);
  } catch (err) {
    console.log(err);
    // return res.status(400).json({ error: "Create product failed" });
    return res.status(400).json({
      error: err.message,
    });
  }
};

exports.listAll = async (req, res) => {
  let products = await Product.find({})
    .limit(parseInt(req.params.count))
    .populate("category")
    .populate("subs")
    // .populate("defaultOption")
    .populate("options") //
    .sort([["createdAt", "desc"]]) // newest created as the first
    .exec();
  return res.json(products);
};

/**
 * Cascade: remove all options under the requested Product
 *
 */
exports.remove = async (req, res) => {
  logger.debug("Enter function remove to remove requested Product");
  try {
    const product = await Product.findOne({ _id: req.params._id }, "options") //only launch options propertiy from db
      .populate("options")
      .exec();
    // console.log(product);
    const optIds = product.options.map((o) => {
      return o._id;
    });
    logger.info("Deleting ProductOption: " + optIds);
    await ProductOption.deleteMany({ _id: optIds });
    logger.info("Delete ProductOption success");

    logger.info("Deleting Product: " + req.params._id);
    const deletedProd = await Product.findOneAndRemove({
      _id: req.params._id,
    }).exec();
    logger.info("Delete Product success, request fin success");
    return res.json(deletedProd);
  } catch (err) {
    logger.error(err);
    return res.status(400).json({ error: `Product delete failed ${err}` });
  }
};

exports.read = async (req, res) => {
  const product = await Product.findOne({ _id: req.params._id })
    .populate("category")
    .populate("subs")
    .populate("options") //
    .exec();
  return res.json(product);
};

exports.update = async (req, res) => {
  // console.log(req.body);

  try {
    const prodId = req.params._id;
    const product = await Product.findOne({ _id: prodId }, "options") //only launch options propertiy from db
      .exec();
    // product.options as [ 605ca97c75958dbc827f1563, ... ]
    await ProductOption.deleteMany({ _id: product.options });
    const prodOptions = await ProductOption.create(req.body.options);
    const newOptIds = prodOptions.map((o) => {
      return o._id;
    }); // [606497fc11d049676b795c3e, 606497fc11d049676b795c3f, ...]
    req.body.options = newOptIds;
    // remove redundant properties
    delete req.body.__v;
    delete req.body.sold;
    delete req.body.createdAt;
    delete req.body.updatedAt;
    delete req.body._id;

    const updated = await Product.findOneAndUpdate(
      { _id: req.params._id }, // product id
      req.body,
      { new: true }
    ).exec();
    return res.json(updated);
  } catch (err) {
    console.log("PRODUCT UPDATE ERROR : ", err);
    // return res.status(400).send("Product update failed");
    return res.status(400).json({
      error: err.message,
    });
  }
};

// exports.list = async (req, res) => {
//   try {
//     // createdAt/updatedAt, desc/asc, Number
//     const { sort, order, limit } = req.body;
//     const products = await Product.find({})
//       .populate("category")
//       .populate("subs")
//       .populate("options") //
//       .sort([[sort, order]])
//       .limit(limit)
//       .exec();
//     return res.json(products);
//   } catch (err) {
//     console.log("  ERROR : ", err);
//     // return res.status(400).send("Product update failed");
//     return res.status(400).json({
//       error: err.message,
//     });
//   }
// };

// WITH PAGINATION
exports.list = async (req, res) => {
  try {
    // createdAt/updatedAt, desc/asc, Number
    const { sort, order, page, perPage } = req.body;
    const currentPage = page || 1;

    const products = await Product.find({})
      .skip((currentPage - 1) * perPage)
      .populate("category")
      .populate("subs")
      .populate("options") //
      .sort([[sort, order]])
      .limit(perPage)
      .exec();
    return res.json(products);
  } catch (err) {
    console.log("ERROR : ", err);
    // return res.status(400).send("Product update failed");
    return res.status(400).json({
      error: err.message,
    });
  }
};

exports.productsCount = async (req, res) => {
  let total = await Product.find({}).estimatedDocumentCount().exec();
  return res.json(total);
};

/**
 *
 * Note this one is based on category, if one does not
 *  have a category, then it has misleading behavior
 */
exports.listRelated = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).exec();
    if (!product.category) {
      // this product does not have a category
      return res.status(400).json({
        error: "Provided product does not have a category information",
      });
    }

    const related = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
    })
      .limit(Number(req.params.limit))
      .populate("category")
      .populate("subs")
      .populate("options") //
      .exec();
    return res.json(related);
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: err.message,
    });
  }
};

/**
 *
 * A new controller method....
 */
exports.getProductsByCategorySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug }).exec();
    if (!category) {
      return res.status(400).json({
        error: "Category not found",
      });
    }

    const products = await Product.find({ category })
      .populate("category")
      .populate("subs")
      .populate("options") //
      .exec();

    return res.json(products);
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: err.message,
    });
  }
};

/**
 *   new controller method....
 */
exports.getProductsBySubSlug = async (req, res) => {
  try {
    const sub = await Sub.findOne({ slug: req.params.slug }).exec();
    if (!sub) {
      return res.status(400).json({
        error: "Sub not found",
      });
    }
    const products = await Product.find({ subs: sub })
      .populate("category")
      .populate("subs")
      .populate("options") //
      .exec();
    return res.json(products);
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: err.message,
    });
  }
};

const getPagedDataByFindQuery = async (
  req,
  res,
  findQuery,
  sort,
  order,
  currentPage,
  perPage
) => {
  try {
    const products = await Product.find(findQuery).exec();
    if (products.length < 1) {
      return res.json({
        products: [],
        totalCount: 0,
      });
    }
    const productsCount = products.length;
    const productsPerPage = await Product.find(findQuery)
      .skip((currentPage - 1) * perPage)
      .populate("category", "_id name")
      .populate("subs", "_id name")
      .populate("options") //
      .sort([[sort, order]])
      .limit(perPage)
      .exec();
    return res.json({
      products: productsPerPage,
      totalCount: productsCount,
    });
  } catch (err) {
    logger.error(err.message);
    return res.status(400).json({
      error: err.message,
    });
  }
};

/**
 * Search
 */
exports.searchByKeyword = async (req, res) => {
  // text, createdAt/updatedAt, desc/asc, Number, Number
  const { text, sort, order, page, perPage } = req.body;
  const currentPage = page || 1;
  const findQuery = { $text: { $search: text } };

  await getPagedDataByFindQuery(
    req,
    res,
    findQuery,
    sort,
    order,
    currentPage,
    perPage
  );
};

/**
 *
 */
exports.getProductsByCategories = async (req, res) => {
  // category id array, createdAt/updatedAt, desc/asc, Number, Number
  const { categories, sort, order, page, perPage } = req.body;
  const currentPage = page || 1;
  const findQuery = { category: categories };

  await getPagedDataByFindQuery(
    req,
    res,
    findQuery,
    sort,
    order,
    currentPage,
    perPage
  );
};

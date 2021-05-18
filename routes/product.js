const express = require("express");
const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

// controller
const {
  create,
  listAll,
  remove,
  read,
  update,
  list,
  productsCount,
  listRelated,
  getProductsByCategorySlug,
  getProductsBySubSlug,
  searchByKeyword,
  getProductsByCategories,
} = require("../controllers/product");

// routes
router.post("/product", authCheck, adminCheck, create);
router.get("/products/total", productsCount);

router.get("/products/:count", listAll);
router.delete("/product/:_id", authCheck, adminCheck, remove);
router.get("/product/:_id", read);
router.put("/product/:_id", authCheck, adminCheck, update);

router.post("/products", list);

// related
router.get("/product/related/:productId/:limit", listRelated);
// new routes
router.get("/products/by-category/:slug", getProductsByCategorySlug); //
router.get("/products/by-sub/:slug", getProductsBySubSlug); //
// new routes: searching feature
router.post("/products/search", searchByKeyword);
// new routes: find products by categoires
router.post("/products/by-categories", getProductsByCategories);

module.exports = router;

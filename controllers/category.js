const Category = require("../models/category");
const Sub = require("../models/sub");
const slugify = require("slugify");
const pinyin = require("chinese-to-pinyin");

const { errorHandler } = require("../helpers/mongoDBErrorHandler");

const REGEX_CHINESE = /[\u4e00-\u9fff]|[\u3400-\u4dbf]|[\u{20000}-\u{2a6df}]|[\u{2a700}-\u{2b73f}]|[\u{2b740}-\u{2b81f}]|[\u{2b820}-\u{2ceaf}]|[\uf900-\ufaff]|[\u3300-\u33ff]|[\ufe30-\ufe4f]|[\uf900-\ufaff]|[\u{2f800}-\u{2fa1f}]/u;

const slugifyWithChinese = (str) => {
  // detect Chinese characters
  const hasChinese = REGEX_CHINESE.test(str);
  if (!hasChinese) {
    return slugify(str);
  }
  return slugify(pinyin(str, { removeTone: true, keepRest: true }));
};

exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await new Category({
      name,
      slug: slugifyWithChinese(name),
    }).save();
    return res.json(category);
  } catch (err) {
    // console.log(err);
    return res.status(400).json({
      error: errorHandler(err),
    });
  }
};

exports.list = async (req, res) => {
  return res.json(await Category.find({}).sort({ createdAt: -1 }).exec());
  // createdAt of -1 gives sorted data from newest created one ~ oldest
};

/**
 * 
This Method stay no-change.
 */
exports.read = async (req, res) => {
  let category = await Category.findOne({ slug: req.params.slug }).exec();
  return res.json(category);
};

exports.update = async (req, res) => {
  const { name } = req.body; // new name
  try {
    const updated = await Category.findOneAndUpdate(
      { slug: req.params.slug }, // find by
      { name: name, slug: slugifyWithChinese(name) }, // updating column name : value
      { new: true } // return the updated one instead of old one
    );
    return res.json(updated);
  } catch (err) {
    return res.status(400).send("Category update failed");
  }
};

exports.remove = async (req, res) => {
  try {
    console.log("on request of del of slug:", req.params.slug);
    const deleted = await Category.findOneAndDelete({ slug: req.params.slug });
    if (!deleted) {
      return res
        .status(400)
        .json({ error: "Catagory delete failed, maybe slug not found" });
    }
    return res.json(deleted);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Catagory delete failed");
  }
};

exports.getSubs = (req, res) => {
  Sub.find({ parent: req.params._id }).exec((err, subs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        error: "getSubs failed",
      });
    }
    return res.json(subs);
  });
};

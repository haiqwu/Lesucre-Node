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
    const { name, parent } = req.body;
    const sub = await new Sub({
      name,
      parent,
      slug: slugifyWithChinese(name),
    }).save();
    return res.json(sub);
  } catch (err) {
    console.log("Sub Create error: ", err);
    return res.status(400).json({
      error: errorHandler(err),
    });
  }
};

exports.list = async (req, res) => {
  return res.json(await Sub.find({}).sort({ createdAt: -1 }).exec());
  // createdAt of -1 gives sorted data from newest created one ~ oldest
};

/**
 *
 *Stay unchanged.
 */
exports.read = async (req, res) => {
  let sub = await Sub.findOne({ slug: req.params.slug }).exec();
  return res.json(sub);
};

exports.update = async (req, res) => {
  const { name, parent } = req.body; // new name
  try {
    const updated = await Sub.findOneAndUpdate(
      { slug: req.params.slug }, // find by
      { name: name, parent, slug: slugifyWithChinese(name) }, // updating column name : value
      { new: true } // return the updated one instead of old one
    );
    return res.json(updated);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Sub update failed");
  }
};

exports.remove = async (req, res) => {
  try {
    // console.log("on request of del of slug:", req.params.slug);
    const deleted = await Sub.findOneAndDelete({ slug: req.params.slug });
    if (!deleted) {
      return res
        .status(400)
        .json({ error: "Sub delete failed, maybe slug not found" });
    }
    return res.json(deleted);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Sub delete failed");
  }
};

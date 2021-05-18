const Zone = require("../models/zone");
const GroupBuy = require("../models/GroupBuy");
const SingleDelivery = require("../models/SingleDelivery");

exports.createZoneWithGBAndSD = async (req, res) => {
  const { zoneData } = req.body;
  const { groupBuyData } = req.body;
  const { singleDeliveryData } = req.body;

  try {
    const groupBuy = await new GroupBuy(groupBuyData).save();
    console.log("New GroupBuy created ", groupBuy);
    const singleDelivery = await new SingleDelivery(singleDeliveryData).save();
    console.log("New SingleDelivery created, ", singleDelivery);

    zoneData.groupBuy = groupBuy._id;
    zoneData.singleDelivery = singleDelivery._id;

    const zone = await new Zone(zoneData).save();
    console.log("zone created:", zone);

    return res.json(zone);
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: err.message,
    });
  }
};

exports.listAll = async (req, res) => {
  const zones = await Zone.find({})
    .populate("groupBuy")
    .populate("singleDelivery")
    .exec();
  return res.json(zones);
};

exports.getOne = async (req, res) => {
  const zone = await Zone.findOne({ _id: req.params._id })
    .populate("groupBuy")
    .populate("singleDelivery")
    .exec();
  return res.json(zone);
};

exports.updateZoneWithGBAndSD = async (req, res) => {
  const zoneId = req.params._id;

  const { ids } = req.body;

  const { zoneData } = req.body;
  const { groupBuyData } = req.body;
  const { singleDeliveryData } = req.body;

  const { groupById } = ids;
  const { singleDeliveryId } = ids;
  try {
    const newZone = await Zone.findOneAndUpdate({ _id: zoneId }, zoneData, {
      new: true,
    }).exec();
    await GroupBuy.findOneAndUpdate({ _id: groupById }, groupBuyData, {
      new: true,
    }).exec();
    await SingleDelivery.findOneAndUpdate(
      { _id: singleDeliveryId },
      singleDeliveryData,
      { new: true }
    ).exec();
    return res.json(newZone);
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: err.message,
    });
  }
};

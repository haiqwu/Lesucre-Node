const Sequence = require("../models/sequence");

exports.getNextSequence = async (id) => {
  try {
    const found = await Sequence.findById(id).exec();
    if (!found) {
      // null if not found
      await initSequence(id);
    }

    const result = await Sequence.findOneAndUpdate(
      { _id: id }, // conditions
      {
        $inc: { sequence_value: 1 },
      }, // update
      { new: true } // options
    );
    return result.sequence_value;
  } catch (err) {
    console.log(err);
    throw new Error("Error in generating sequence");
  }
};

const initSequence = async (id) => {
  try {
    await Sequence.create({
      _id: id,
    });
  } catch (err) {
    console.log(err);
    throw new Error("Error in init sequence");
  }
};

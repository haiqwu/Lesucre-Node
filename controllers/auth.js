const User = require("../models/user");

exports.createOrUpdateUser = async (req, res) => {
  const { name, email } = req.user;
  // console.log("name got:", name);

  const user = await User.findOneAndUpdate(
    { email: email }, // search critieria (find by ...)
    { display_name: name },
    { new: true } // return the updated result instead of old one
  );
  if (user) {
    console.log("USER UPDATED", user);
    return res.json(user);
  }
  // user not found case:
  const newUser = await new User({
    email: email,
    display_name: name,
  }).save();
  console.log("USER CREATED", newUser);
  return res.json(newUser);
};

exports.currentUser = async (req, res) => {
  User.findOne({ email: req.user.email }).exec((err, user) => {
    if (err) {
      throw new Error(err);
    }
    return res.json(user);
  });
};

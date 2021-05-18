const admin = require("../firebase");
const User = require("../models/user");

exports.authCheck = async (req, res, next) => {
  // console.log(req.headers); // token
  try {
    const firebaseUser = await admin
      .auth()
      .verifyIdToken(req.headers.authtoken);

    const userRecord = await admin.auth().getUser(firebaseUser.uid);
    // console.log("Detail version of user record: ", userRecord);
    firebaseUser.name = userRecord.displayName; // Make sure name is there - bug fix
    // console.log("FIREBASE USER IN AUTHCHECK: ", firebaseUser);
    req.user = firebaseUser;
    next();
  } catch (err) {
    console.log(err);
    res.status(440).json({
      error: "Invalid or expired token",
    });
  }
};

exports.adminCheck = async (req, res, next) => {
  const { email } = req.user;
  const adminUser = await User.findOne({ email }).exec();
  if (adminUser.role !== "admin") {
    return res.status(403).json({
      err: "Access denied.",
    });
  }
  next();
};

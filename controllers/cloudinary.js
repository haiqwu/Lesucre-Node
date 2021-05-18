const cloudinary = require("cloudinary");
const fs = require("fs");
const formidable = require("formidable");

// config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.upload = async (req, res) => {
  console.log("Start Processing upload image");
  try {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          error: "Image could not be uploaded, fail in parsing form",
        });
      }
      // console.log(fields.image);
      const result = await cloudinary.v2.uploader.upload(fields.image, {
        public_id: `${Date.now()}`,
        resource_type: "auto", // jpeg, png
      });
      // console.log(" finished success!");
      return res.json({
        public_id: result.public_id,
        url: result.secure_url,
      });
      // console.log(fields.image);
      // if (files.image) {
      //   console.log(files.image);
      // }
    });
  } catch (err) {
    console.log("error with ", err);
    return res.status(400).json({
      error: err.message,
      success: false,
    });
  }
};

exports.remove = (req, res) => {
  let image_id = req.body.public_id;

  cloudinary.v2.uploader.destroy(image_id, (err, result) => {
    if (err) {
      return res
        .status(400)
        .json({ success: false, err, error: "Remove img fail" });
    }
    return res.send("ok");
  });
};

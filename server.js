const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs"); // file system
const logger = require("./config/winston-logger");
require("dotenv").config();

// app
const app = express();

// db connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true, // use the new Server Discover and Monitoring engine
  })
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(`DB Connection Error : ${err}`));

// middlewares

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl} - ${new Date()}`);
  logger.info(`req params:   ${JSON.stringify(req.params)}`);
  logger.info("req body: " + req.body);

  next();
});

app.use(cors());
app.use(express.json({ limit: "50mb" })); // body parser
// app.use(bodyParser.json({ limit: "5mb" }));

// routes middleware (auto require, and auto use , auto prefix '/api')
fs.readdirSync("./routes").map((r) =>
  app.use("/api", require("./routes/" + r))
);

// port
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server is running on port ${port}`));

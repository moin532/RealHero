const express = require("express");
const bodyParser = require("body-parser");
const env = require("dotenv");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const app = express();

app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use(cors());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
env.config({ path: "./config/config.env" });

const userRoute = require("./routes/userRoute");
const prdRoute = require("./routes/productsRoute");

app.use("/api/v1/", userRoute);
app.use("/api/v1/", prdRoute);

module.exports = app;

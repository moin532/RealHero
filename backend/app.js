const express = require("express");
const bodyParser = require("body-parser");
const env = require("dotenv");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const app = express();
const path = require("path");
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
env.config({ path: "./config/config.env" });

const userRoute = require("./routes/userRoute");
const prdRoute = require("./routes/productsRoute");
const adminRoute = require("./routes/AdminRoute");
const driversafetyRoute = require("./routes/DriverSafetyRoute");

app.use("/api/v1/", adminRoute);
app.use("/api/v1/", userRoute);
app.use("/api/v1/", prdRoute);
app.use("/api/v1/", driversafetyRoute);

module.exports = app;

const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: String,
  number: { type: String, unique: true },
  password: String,
  location: String,
  role: { type: String, default: "admin" },
  permissions: {
    DriverManage: { type: Boolean, default: false },
    DriverRequest: { type: Boolean, default: false },
    AdminCreate: { type: Boolean, default: false },
  },
});

module.exports = mongoose.model("AdminHero", adminSchema);

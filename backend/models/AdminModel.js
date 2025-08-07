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
    DriverMaps: { type: Boolean, default: false },
    DriverSafety: { type: Boolean, default: false },
    BusinessManage: { type: Boolean, default: false },
    AllAdmins: { type: Boolean, default: false },
    Dashboard: { type: Boolean, default: true }, // Default true for all admins
  },
});

module.exports = mongoose.model("AdminHero", adminSchema);

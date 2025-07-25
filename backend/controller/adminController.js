const Admin = require("../models/AdminModel");
const bcrypt = require("bcrypt");

exports.createAdmin = async (req, res) => {
  const { name, number, password, location, permisssion } = req.body;

  try {
    const existing = await Admin.findOne({ number });
    if (existing)
      return res
        .status(400)
        .json({ message: "Admin already exists with this number" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new Admin({
      name,
      number,
      password: hashedPassword,
      location,
      permisssion,
      role: "admin",
    });

    await admin.save();

    res.status(201).json({ message: "Admin created successfully", admin });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();

    if (!admins || admins.length === 0) {
      return res.status(404).json({ message: "No admins found" });
    }

    res.status(200).json({ success: true, admins });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    const admin = await Admin.findByIdAndDelete(id);

    res
      .status(200)
      .json({ success: true, message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

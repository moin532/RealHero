const express = require("express");
const {
  createAdmin,
  getAllAdmins,
  deleteAdmin,
} = require("../controller/adminController");
const {
  authorizeRoles,
  authMiddle,
  checkStatus,
} = require("../middleware/auth");
const router = express.Router();

router.route("/add/admin").post(
  // authMiddle,
  // authorizeRoles("admin"),
  // checkStatus("canViewUsers"),
  createAdmin
);
router.route("/get/admin").post(
  // authMiddle, authorizeRoles("admin"),

  getAllAdmins
);
router
  .route("/delete/admin/:id")
  .delete(authMiddle, authorizeRoles("admin"), deleteAdmin);

module.exports = router;

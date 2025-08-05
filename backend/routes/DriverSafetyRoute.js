const express = require("express");
const router = express.Router();
const {
  createSafety,
  updateSafety,
  deleteSafety,
  getDetailSafety,
  getAllDetailSafety,
  updateCurrentLocation,
  getDriverCurrentLocation
} = require("../controller/DriverController");
const { authMiddle } = require("../middleware/auth");

// POST /api/safety - Add new entry
router.post("/create/safety", createSafety);
router.get("/all/safety", getAllDetailSafety);

// PUT /api/safety/:id - Edit entry
router.put("/create/safety/:id", getDetailSafety);
router.put("/create/safety/:id", updateSafety);

// DELETE /api/safety/:id - Delete entry
router.delete("/create/safety/:id", deleteSafety);


router.post("/update/location",authMiddle, updateCurrentLocation);
router.get("/get/location", getDriverCurrentLocation);
module.exports = router;

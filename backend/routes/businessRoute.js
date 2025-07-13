// routes/businessRoute.js
const express = require("express");
const {
  createBusiness,
  getAllBusinesses,
  getBusinessById,
  updateBusiness,
  deleteBusiness,
} = require("../controller/businessController");

const router = express.Router();

router.post("/create", createBusiness);
router.get("/buisness", getAllBusinesses);
router.get("/:id", getBusinessById);
router.put("/update/:id", updateBusiness);
router.delete("/delete/:id", deleteBusiness);

module.exports = router;

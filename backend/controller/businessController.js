// import Business from '../models/Business.js';

const Business = require("../models/buisnessModel");
// CREATE a new business
exports.createBusiness = async (req, res) => {
  try {
    const business = new Business(req.body);
    const savedBusiness = await business.save();
    res.status(201).json({
      success: true,
      message: "Business created successfully",
      data: savedBusiness,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating business",
      error: error.message,
    });
  }
};

// GET all businesses
exports.getAllBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find();
    res.status(200).json({
      success: true,
      data: businesses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch businesses",
      error: error.message,
    });
  }
};

// GET business by ID
exports.getBusinessById = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    res.status(200).json({
      success: true,
      data: business,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching business",
      error: error.message,
    });
  }
};

// UPDATE business by ID
exports.updateBusiness = async (req, res) => {
  try {
    const updatedBusiness = await Business.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedBusiness) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Business updated successfully",
      data: updatedBusiness,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating business",
      error: error.message,
    });
  }
};

// DELETE business by ID
exports.deleteBusiness = async (req, res) => {
  try {
    const deletedBusiness = await Business.findByIdAndDelete(req.params.id);

    if (!deletedBusiness) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Business deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting business",
      error: error.message,
    });
  }
};

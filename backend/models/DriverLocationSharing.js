const mongoose = require('mongoose');

const locationSharing = new mongoose.Schema({
    driverId: { type: String, required: true },
    currentLatitude: { type: String, required: true },
    currentLongitude: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("LocationSharing", locationSharing);
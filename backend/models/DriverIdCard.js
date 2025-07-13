const mongoose = require('mongoose');
const DriverIdCardSchema = new mongoose.Schema({
    name: String,
    fatherName: String,
    designation: String,
    mobile: String,
    dlNo: String,
    policeStation: String,
    city: String,
    state: String,
    bloodGroup: String,
    dob: String,
    cardNo: String,
    issueDate: String,
    expiryDate: String,
    memberAddress: String,
    photoUrl: String,
    qrUrl: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});
module.exports = mongoose.model('DriverIdCard', DriverIdCardSchema); 
const mongoose = require("mongoose");

const normalUserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        minLength: [2, "Name should be more than 2 characters"],
    },
    number: {
        type: String,
        required: [true, "Please enter your phone number"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength: [8, "Password should be greater than 8 characters"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("NormalUser", normalUserSchema); 
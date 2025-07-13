const NormalUser = require("../models/NormalUserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Register normal user
exports.registerNormalUser = async (req, res) => {
    try {
        const { name, number, password } = req.body;
        if (!name || !number || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingUser = await NormalUser.findOne({ number });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists with this number" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await NormalUser.create({ name, number, password: hashedPassword });

        console.log(user, "Dededed in normal")
        const Token = jwt.sign(
            {
                number: user.number,
                user_id: user._id,
            },
            "moinSecret",
            { expiresIn: "10d" }
        );
        res.status(200).json({
            success: true,
            Token,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Login normal user
exports.loginNormalUser = async (req, res) => {
    try {
        const { number, password } = req.body;
        if (!number || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await NormalUser.findOne({ number });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const Token = jwt.sign(
            {
                number: user.number,
                user_id: user._id,
            },
            "moinSecret",
            { expiresIn: "10d" }
        );

        res.status(200).json({
            success: true,
            Token,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}; 
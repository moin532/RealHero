const DriverIdCard = require('../models/DriverIdCard');
const path = require('path');
const fs = require('fs');
// const QRCode = require('qrcode');

// POST /api/driver-id/apply
exports.applyForIdCard = async (req, res) => {
    try {
        // Handle file upload (photo)
        let photoUrl = '';
        if (req.files && req.files.photo) {
            const photo = req.files.photo;
            const photoName = `${Date.now()}-${photo.name.replace(/\s+/g, '_')}`;
            const photoPath = path.join(__dirname, '../uploads/images', photoName);
            await photo.mv(photoPath);
            photoUrl = `/uploads/images/${photoName}`;
        }

        // Generate QR code for verification link
        const cardNo = req.body.cardNo || `CARD${Date.now()}`;
        const qrData = `${process.env.FRONTEND_URL || ' https://api.realhero.in'}/driver-id/${cardNo}`;
        const qrPath = path.join(__dirname, '../uploads/images', `${cardNo}-qr.png`);
        // await QRCode.toFile(qrPath, qrData);
        const qrUrl = `/uploads/images/${cardNo}-qr.png`;

        // Save to DB, require userId from req.user
        if (!req.user || !req.user._id) {
            return res.status(401).json({ success: false, error: 'Unauthorized: user not found in token' });
        }
        const card = await DriverIdCard.create({
            ...req.body,
            cardNo,
            photoUrl,
            qrUrl,
            userId: req.user._id,
        });
        res.status(201).json({ success: true, card });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
};

// GET /api/driver-id/:id
exports.getIdCard = async (req, res) => {
    try {
        const card = await DriverIdCard.findById(req.params.id);
        if (!card) return res.status(404).json({ success: false, error: 'Card not found' });
        res.json({ success: true, card });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// GET /api/driver-id/user/:userId
exports.getIdCardByUser = async (req, res) => {
    try {
        const card = await DriverIdCard.findOne({ userId: req.params.userId });
        if (!card) return res.status(404).json({ success: false, error: 'Card not found for user' });
        res.json({ success: true, card });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}; 
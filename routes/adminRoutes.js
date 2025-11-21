const express = require("express");
const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Admin Login
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username, password });
    if (!admin) return res.status(401).json({ message: "Invalid admin login" });

    const token = jwt.sign({ adminId: admin._id }, "ADMIN_SECRET");

    res.json({ token });
});

module.exports = router;

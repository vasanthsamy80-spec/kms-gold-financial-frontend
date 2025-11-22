
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 🔐 Secret key for signing JWT
const JWT_SECRET = process.env.JWT_SECRET;
// You can change this to something unique

// ✅ Register route
router.post('/register', async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser)
      return res.status(400).json({ message: 'User already exists with that email or phone' });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save new user
    const newUser = new User({ email, phone, password: hashedPassword });
    await newUser.save();

    res.json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
/// ✅ LOGIN ROUTE (Email OR Phone)
router.post('/login', async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    if ((!email && !phone) || !password) {
      return res.status(400).json({ message: "Email/Phone and password required" });
    }

    // ✅ Proper query logic
    let user;
    if (email) {
      user = await User.findOne({ email: email.trim().toLowerCase() });
    } else if (phone) {
      user = await User.findOne({ phone: phone.trim() });
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid email/phone or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email/phone or password" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ FORGOT / RESET PASSWORD (Email or Phone)
router.post('/forgot-password', async (req, res) => {
  try {
    // Accept either { email, newPassword } OR { phone, newPassword }
    let { email, phone, newPassword } = req.body;

    if (!newPassword || (!email && !phone)) {
      return res.status(400).json({ message: "Email/Phone and newPassword are required" });
    }

    // Normalize input
    if (email) email = email.trim().toLowerCase();
    if (phone) phone = phone.trim();

    // Find user by normalized email OR phone
    const user = await User.findOne({
      $or: [
        email ? { email } : null,
        phone ? { phone } : null
      ].filter(Boolean)
    });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Hash new password and save on user instance
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    return res.json({ message: "✅ Password changed successfully! Please log in with your new password." });
  } catch (err) {
    console.error("Reset Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});







module.exports = router;


// routes/loanRoutes.js
const express = require("express");
const router = express.Router();
const Loan = require("../models/Loan");
const InterestHistory = require("../models/InterestHistory");

// ✅ Buy Gold Loan and Save
router.post("/buy", async (req, res) => {
  try {
    const loan = new Loan(req.body);
    await loan.save();
    res.json({ message: "✅ Gold Loan saved successfully!" });
  } catch (err) {
    console.error("❌ Error saving loan:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/pay-interest", async (req, res) => {
  try {
    const { userEmail, amount } = req.body;

    if (!userEmail || !amount) {
      return res.status(400).json({ message: "userEmail and amount required" });
    }

    const savePayment = new InterestHistory({
      userEmail,
      amountPaid: amount,   // correct field
      paymentDate: new Date() // optional, auto created
    });

    await savePayment.save();

    res.json({ message: "Interest payment saved successfully!" });

  } catch (error) {
    console.error("❌ Error saving interest:", error);
    res.status(500).json({ error: "Failed to save interest" });
  }
});



// ✅ FETCH LOAN HISTORY
router.get("/history/:email", async (req, res) => {
  try {
    const loans = await Loan.find({ userEmail: req.params.email }).sort({ createdAt: -1 });
    res.json(loans);
  } catch (err) {
    console.error("❌ Error fetching loan history:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ FIXED: FETCH INTEREST PAYMENT HISTORY
router.get("/interest-history/:email", async (req, res) => {
  try {
    const payments = await InterestHistory.find({ userEmail: req.params.email })
      .sort({ paymentDate: -1 });

    res.json(payments);
  } catch (err) {
    console.error("❌ Error fetching interest history:", err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;


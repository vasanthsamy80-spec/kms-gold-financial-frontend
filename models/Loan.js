const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true },
    phone: { type: String },
    purity: String,
    goldWeight: Number,
    goldRate: Number,
    loanAmount: Number,
    days: Number,
    interestRate: Number,
    interest: Number,
    totalPayable: Number
  },
  { timestamps: true }    // ⭐⭐⭐ THIS IS WHAT WAS MISSING
);

module.exports = mongoose.model("Loan", loanSchema);

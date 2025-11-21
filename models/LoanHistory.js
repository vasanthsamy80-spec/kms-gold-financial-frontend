const mongoose = require("mongoose");

const loanHistorySchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  goldAmount: Number,
  loanAmount: Number,
  interestRate: Number,
  dateTaken: { type: Date, default: Date.now },
  status: { type: String, enum: ["active", "closed"], default: "active" },
});

module.exports = mongoose.model("LoanHistory", loanHistorySchema);

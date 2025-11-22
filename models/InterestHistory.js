
const mongoose = require("mongoose");

const InterestHistorySchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true
  },
  amountPaid: {
    type: Number,
    required: true
  },
  paymentDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("InterestHistory", InterestHistorySchema);


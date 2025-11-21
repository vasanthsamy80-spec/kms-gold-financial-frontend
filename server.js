const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
const adminRoutes = require("./routes/adminRoutes");
app.use("/admin", adminRoutes);
const pdfRoutes = require("./routes/pdfRoutes");
app.use("/pdf", pdfRoutes);
const PDFDocument = require("pdfkit");
const Loan = require("./models/Loan");



// MongoDB connection
const uri = 'mongodb+srv://golduser:gold1234@cluster0.o61zfho.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(uri)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ Connection Error:', err));

// Import routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// ✅ Important — singular “loan”
const loanRoutes = require('./routes/loanRoutes');
app.use('/api/loans', loanRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Welcome to Gold Financial API 💰');
});


app.get("/pdf/loan-receipt/:id", async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);

    if (!loan) {
      return res.status(404).send("Loan not found");
    }

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=loan-receipt.pdf");

    doc.pipe(res);

    // Title
    doc.fontSize(28).text("KMS GOLD FINANCE", { align: "center" });
    doc.moveDown(1);
    doc.fontSize(20).text("Loan Receipt", { align: "center" });
    doc.moveDown(2);

    // Loan Details (Using EXACT database field names)
    doc.fontSize(14).text(`Customer Email: ${loan.userEmail}`);
    doc.moveDown(0.5);
    doc.text(`Loan Amount: ₹${loan.loanAmount}`);
    doc.moveDown(0.5);
    doc.text(`Gold Weight: ${loan.goldWeight} grams`);
    doc.moveDown(0.5);
    doc.text(`Purity: ${loan.purity}`);
    doc.moveDown(0.5);
    doc.text(`Interest Rate: ${loan.interestRate}%`);
    doc.moveDown(0.5);
    doc.text(`Interest: ₹${loan.interest}`);
    doc.moveDown(0.5);
    doc.text(`Total Payable: ₹${loan.totalPayable}`);
    doc.moveDown(0.5);
    doc.text(`Days: ${loan.days}`);
    doc.moveDown(0.5);
    doc.text(`Date: ${new Date(loan.createdAt).toLocaleString()}`);
    doc.moveDown(2);

    doc.text("Thank you for choosing KMS Gold Finance.");

    doc.end();
  } catch (err) {
    console.error("PDF Error:", err);
    res.status(500).send("Error generating PDF");
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

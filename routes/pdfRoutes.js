
const express = require("express");
const PDFDocument = require("pdfkit");
const Loan = require("../models/Loan");
const InterestHistory = require("../models/InterestHistory");

const router = express.Router();


// =========================
// 1️⃣ LOAN RECEIPT PDF
// =========================

router.get("/loan-receipt/:loanId", async (req, res) => {
    try {
        const loan = await Loan.findById(req.params.loanId);
        if (!loan) return res.status(404).send("Loan not found");

        const doc = new PDFDocument();
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=loan_receipt.pdf");

        doc.pipe(res);

        doc.fontSize(22).text("KMS GOLD FINANCE", { align: "center" });
        doc.moveDown();
        doc.fontSize(16).text("Loan Receipt", { align: "center" });
        doc.moveDown();

        doc.fontSize(12).text(`Customer Email: ${loan.userEmail}`);
        doc.text(`Phone: ${loan.phone}`);
        doc.text(`Purity: ${loan.purity}`);
        doc.text(`Gold Weight: ${loan.goldWeight} grams`);
        doc.text(`Gold Rate: ₹${loan.goldRate}`);
        doc.text(`Loan Amount: ₹${loan.loanAmount}`);
        doc.text(`Interest Rate: ${loan.interestRate}%`);
        doc.text(`Interest: ₹${loan.interest}`);
        doc.text(`Total Payable: ₹${loan.totalPayable}`);
        doc.text(`Days: ${loan.days}`);
        doc.text(`Date: ${new Date(loan.createdAt).toLocaleString()}`);

        doc.moveDown();
        doc.text("Thank you for choosing KMS Gold Finance.");

        doc.end();

    } catch (err) {
        console.error(err);
        res.status(500).send("Error generating PDF");
    }
});



// =========================
// 2️⃣ INTEREST PAYMENT RECEIPT PDF
// =========================

router.get("/interest-receipt/:id", async (req, res) => {
    try {
        const payment = await InterestHistory.findById(req.params.id);
        if (!payment) return res.status(404).send("Interest record not found");

        const doc = new PDFDocument();
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=interest_receipt.pdf");

        doc.pipe(res);

        doc.fontSize(22).text("KMS GOLD FINANCE", { align: "center" });
        doc.moveDown();
        doc.fontSize(16).text("Interest Payment Receipt", { align: "center" });
        doc.moveDown();

        doc.fontSize(12).text(`Customer: ${payment.customerName}`);
        doc.text(`Loan ID: ${payment.loanId}`);
        doc.text(`Amount Paid: ₹${payment.amount}`);
        doc.text(`Paid On: ${payment.date}`);

        doc.moveDown();
        doc.text("Thank you for your payment!");

        doc.end();

    } catch (err) {
        console.error(err);
        res.status(500).send("Error generating PDF");
    }
});


module.exports = router;


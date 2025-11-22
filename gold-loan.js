
// gold-loan.js
// Example/static per-gram prices (you can change later or fetch from goldRate)
const rate24 = parseFloat(document.getElementById("rate24").value) || 6200;
const rate22 = parseFloat(document.getElementById("rate22").value) || 5700;
const pricePerGram = purity === "24K" ? rate24 : rate22;

// gold-loan.js
// gold-loan.js

function format(n) {
  return Number(n || 0).toFixed(2);
}

// 🟡 CALCULATE BUTTON
document.getElementById("calculateBtn").addEventListener("click", () => {
  const purity = document.getElementById("purity").value;
  const rate = parseFloat(document.getElementById("rate24").value || 0);
  const weightGram = parseFloat(document.getElementById("weightGram").value || 0);
  const requestedAmount = parseFloat(document.getElementById("requestedAmount").value || 0);
  const days = parseInt(document.getElementById("days").value || 0);

  if (!weightGram || !requestedAmount || !days || !rate) {
    alert("Please enter all fields (rate, weight, amount, and days)");
    return;
  }

  const pricePerGram = rate;
  const maxEligible = weightGram * pricePerGram;
  const disbursed = Math.min(requestedAmount, maxEligible);

  let interestRate;
  if (days <= 90) interestRate = 18.25;
  else if (days < 365) interestRate = 24;
  else interestRate = 30;

  const interestAmount = disbursed * (interestRate / 100) * (days / 365);
  const totalPayable = disbursed + interestAmount;

  // Show results on screen
  document.getElementById("pricePerGram").textContent = format(pricePerGram);
  document.getElementById("maxEligible").textContent = format(maxEligible);
  document.getElementById("disbursed").textContent = format(disbursed);
  document.getElementById("ratePercent").textContent = interestRate.toFixed(2);
  document.getElementById("interestAmt").textContent = format(interestAmount);
  document.getElementById("totalPay").textContent = format(totalPayable);
  document.getElementById("resultBox").style.display = "block";
});

const API = "https://kms-gold-financial-2.onrender.com";

document.getElementById("buyLoanBtn").addEventListener("click", async () => {
  const userEmail = localStorage.getItem("userEmail") || prompt("Enter your email:");
  if (!userEmail) return alert("Email required!");

  const purity = document.getElementById("purity").value;
  const goldWeight = parseFloat(document.getElementById("weightGram").value);
  const days = parseInt(document.getElementById("days").value);
  const loanAmount = parseFloat(document.getElementById("requestedAmount").value);
  const goldRate = parseFloat(document.getElementById("rate24").value);
  const interestRate = parseFloat(document.getElementById("ratePercent").textContent);
  const interest = parseFloat(document.getElementById("interestAmt").textContent);
  const totalPayable = parseFloat(document.getElementById("totalPay").textContent);

  const phone = localStorage.getItem("userPhone") || "";

  try {
    const res = await fetch(`${API}/api/loans/buy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userEmail,
        phone,
        purity,
        goldWeight,
        goldRate,
        loanAmount,
        days,
        interestRate,
        interest,
        totalPayable
      }),
    });

    const data = await res.json();
    alert(data.message || "Loan saved successfully!");
  } catch (err) {
    console.error(err);
    alert("Failed to save loan!");
  }
});

// PAY INTEREST
document.getElementById("payInterestBtn").addEventListener("click", async () => {
  const userEmail = localStorage.getItem("userEmail");
  const amount = parseFloat(document.getElementById("interestAmt").textContent);

  try {
    const res = await fetch(`${API}/api/loans/pay-interest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userEmail, amount }),
    });

    const data = await res.json();
    alert(data.message || "Interest payment saved!");
  } catch (err) {
    console.error(err);
    alert("Failed to save payment!");
  }
});


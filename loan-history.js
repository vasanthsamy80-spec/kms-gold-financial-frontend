
const BASE_URL = "https://kms-gold-financial-4.onrender.com";


document.addEventListener("DOMContentLoaded", async () => {
  const email = localStorage.getItem("userEmail");
  const container = document.getElementById("loanHistoryContainer");

  if (!email) {
    container.innerHTML = "<p>Please log in first.</p>";
    return;
  }

  try {
    const res = await fetch(`${API}/api/loans/history/${email}`);
    const data = await res.json();

    if (!data.length) {
      container.innerHTML = "<p>No loans found.</p>";
      return;
    }

    data.forEach(loan => {
      const div = document.createElement("div");

      div.innerHTML = `
        <table style="margin:20px auto;width:45%;border-collapse:collapse;background:white;">
          <tr><td><b>Loan Amount:</b></td><td>₹${loan.loanAmount}</td></tr>
          <tr><td><b>Gold Weight:</b></td><td>${loan.goldWeight} g</td></tr>
          <tr><td><b>Interest Rate:</b></td><td>${loan.interestRate}%</td></tr>
          <tr><td><b>Total Payable:</b></td><td>₹${loan.totalPayable}</td></tr>
          <tr><td><b>Date:</b></td><td>${new Date(loan.createdAt).toLocaleString()}</td></tr>
        </table>

        <button class="btn"
          onclick="window.location.href='${API}/pdf/loan-receipt/${loan._id}'">
          Download PDF
        </button>
        <br><br>
      `;

      container.appendChild(div);
    });

  } catch (err) {
    container.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
  }
});


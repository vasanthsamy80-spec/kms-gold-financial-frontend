document.addEventListener("DOMContentLoaded", async () => {
    const email = localStorage.getItem("userEmail");
    const container = document.getElementById("loanHistoryContainer");

    if (!email) {
        container.innerHTML = "<p>Please log in first.</p>";
        return;
    }

    try {
        const res = await fetch(`http://localhost:3000/api/loans/history/${email}`);
        if (!res.ok) throw new Error("Server returned " + res.status);

        const data = await res.json();

        if (!data.length) {
            container.innerHTML = "<p>No loans found.</p>";
            return;
        }

        // 👉 Loop through each loan and create a separate table + PDF button
        data.forEach(loan => {
            const div = document.createElement("div");

            div.innerHTML = `
                <table style="margin: 20px auto; width: 45%; border-collapse: collapse; background: white; 
                              box-shadow: 0 0 10px rgba(0,0,0,0.2);">
                    <tr><td><b>Loan Amount:</b></td><td>₹${loan.loanAmount}</td></tr>
                    <tr><td><b>Gold Amount:</b></td><td>${loan.goldWeight} g</td></tr>
                    <tr><td><b>Interest Rate:</b></td><td>${loan.interestRate}%</td></tr>
                    <tr><td><b>Total Payable:</b></td><td>₹${loan.totalPayable}</td></tr>
                    <tr><td><b>Date:</b></td><td>${new Date(loan.createdAt).toLocaleString()}</td></tr>
                </table>

                <!-- ⭐ PDF button for THIS loan -->
                <button class="btn" 
                    onclick="window.location.href='http://localhost:3000/pdf/loan-receipt/${loan._id}'">
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

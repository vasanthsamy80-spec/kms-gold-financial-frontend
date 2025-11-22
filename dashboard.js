
document.addEventListener("DOMContentLoaded", function () {
  // ✅ Check login
  const userEmail = localStorage.getItem("userEmail");
  if (!userEmail) {
    alert("Please log in first!");
    window.location.href = "index.html";
  }

  const userEmailBox = document.getElementById("userEmail");
  if (userEmailBox) userEmailBox.textContent = "Logged in as: " + userEmail;

  // ✅ Logout
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("userEmail");
      window.location.href = "index.html";
    });
  }

  // ✅ API Key
  const apiKey = "goldapi-4ejd0m91vmhlyd06d-io";

  // ✅ Fetch gold rates
  async function fetchLiveGoldRate() {
    try {
      const res = await fetch("https://www.goldapi.io/api/XAU/INR", {
        headers: {
          "x-access-token": apiKey,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (!data.price) throw new Error("No price received");
      const g24 = (data.price / 31.1035).toFixed(2);
      const g22 = (g24 * 0.916).toFixed(2);
      return { g24, g22 };
    } catch (err) {
      console.error("Error:", err);
      return null;
    }
  }

  // ✅ Show live gold rate
  async function showLiveGoldRate() {
    document.getElementById("content").innerHTML = `
      <h3>Live Gold Rate (India)</h3>
      <label for="puritySelect">Select Purity:</label>
      <select id="puritySelect">
        <option value="24">24K Gold</option>
        <option value="22">22K Gold</option>
      </select>
      <p id="goldPrice">Loading...</p>
      <p style="font-size: small; color: gray;" id="lastUpdated"></p>
    `;

    const rates = await fetchLiveGoldRate();
    if (rates) {
      const puritySelect = document.getElementById("puritySelect");
      const goldPrice = document.getElementById("goldPrice");

      const updateDisplay = () => {
        goldPrice.textContent =
          puritySelect.value === "24"
            ? `24K Gold: ₹${rates.g24} / gram`
            : `22K Gold: ₹${rates.g22} / gram`;

        document.getElementById("lastUpdated").textContent =
          `Last updated: ${new Date().toLocaleTimeString()}`;
      };

      puritySelect.addEventListener("change", updateDisplay);
      updateDisplay();
    } else {
      document.getElementById("goldPrice").textContent = "Error fetching rate.";
    }
  }

  // ❗ Auto refresh
  setInterval(() => {
    const content = document.getElementById("content").textContent;
    if (content.includes("Live Gold Rate")) showLiveGoldRate();
  }, 300000);

  // -----------------------------------------------------
  // ✅ BUTTONS (NOW WORK 100%!)
  // -----------------------------------------------------

  const loanBtn = document.getElementById("loanCalcBtn");
  if (loanBtn) loanBtn.addEventListener("click", () => {
    window.location.href = "gold-loan.html";
  });

  const rateBtn = document.getElementById("viewRateBtn");
  if (rateBtn) rateBtn.addEventListener("click", () => {
    window.location.href = "goldRate.html";
  });

  const interestBtn = document.getElementById("interestCalcBtn");
  if (interestBtn) interestBtn.addEventListener("click", () => {
    window.location.href = "interest-calculator.html";
  });
});


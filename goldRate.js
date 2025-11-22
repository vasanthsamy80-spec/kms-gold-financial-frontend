
const apiKey = "goldapi-4ejd0m91vmhlyd06d-io";

async function fetchGoldRate() {
  try {
    // Fetch gold rate for India in INR
    const response = await fetch("https://www.goldapi.io/api/XAU/INR", {
      headers: { "x-access-token": apiKey, "Content-Type": "application/json" }
    });
    const data = await response.json();

    if (!data.price) throw new Error("Invalid API response");

    // price of 1 oz gold (31.1035 grams)
    const gold24K = (data.price / 31.1035).toFixed(2);
    const gold22K = (gold24K * 0.916).toFixed(2);

    document.getElementById("gold24").textContent = gold24K;
    document.getElementById("gold22").textContent = gold22K;

    const date = new Date(data.timestamp * 1000);
    document.getElementById("lastUpdated").textContent =
      `Last updated: ${date.toLocaleString()}`;
  } catch (err) {
    document.getElementById("gold24").textContent = "Error";
    document.getElementById("gold22").textContent = "Error";
    console.error(err);
  }
}

fetchGoldRate();
setInterval(fetchGoldRate, 3600000); // refresh every hour/ auto refresh every 1 hour


function showSelectedRate() {
  const purity = document.getElementById("puritySelect").value;
  const price = purity === "24"
    ? document.getElementById("gold24").textContent
    : document.getElementById("gold22").textContent;
  document.getElementById("selectedRate").textContent = `${purity}K Gold Rate: ₹${price}`;
}
function drawGoldChart() {
  const ctx = document.getElementById("goldChart");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Gold Rate (24K ₹/g)",
          data: [6070, 6090, 6100, 6125, 6150, 6180, 6200],
          borderColor: "gold",
          borderWidth: 2,
          fill: false,
        },
      ],
    },
  });
}

fetchGoldRate();


// main.js - Central Main Program connecting to 4 microservices
const PORT_FAVORITES = 6070;
const PORT_FORECAST = 3333;
const PORT_IMAGE = 5001;
const PORT_QUOTE = 5010;

const cors = require("cors");
app.use(cors());

async function runDashboard() {
  console.log("=== STARTING MAIN PROGRAM DASHBOARD ==-\n");

  try {
    // 1. Fetch from Favorites Service (Small Pool)
    console.log("Fetching favorites...");
    const favRes = await fetch(`http://localhost:${PORT_FAVORITES}/favorites`);
    const favData = await favRes.json();
    console.log("Favorites Result:", favData);

    // 2. Fetch from Forecast Service (Big Pool)
    console.log("\nFetching weather forecast (Portland)...");
    const forecastRes = await fetch(
      `http://localhost:${PORT_FORECAST}/forecast?location=Portland`,
    );
    const forecastData = await forecastRes.json();
    console.log("Forecast Result:", forecastData);

    // 3. Fetch from Image Service (Big Pool)
    console.log("\nFetching image data...");
    const imageRes = await fetch(
      `http://localhost:${PORT_IMAGE}/api/image?q=workout`,
    );
    const imageData = await imageRes.json();
    console.log("Image Result:", imageData);

    // 4. Fetch from Quote Service (Big Pool)
    console.log("\nFetching daily quote...");
    const quoteRes = await fetch(`http://localhost:${PORT_QUOTE}/quote`);
    const quoteData = await quoteRes.json();
    console.log("Quote Result:", quoteData);

    console.log("\n=== ALL MICROSERVICES COMMUNICATED SUCCESSFULLY ===");
  } catch (err) {
    console.error("Error communicating with microservices:", err.message);
  }
}

runDashboard();

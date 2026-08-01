// Test program for small pool weather microservice.
//
//1. Run the service in one terminal: node service.js
//2. Run this test in another terminal: node test_weather_service.js

const location = "Corvallis";

async function main() {
    // request: send a GET request with the location as a query parameter
    const url = "http://localhost:3333/forecast?location=" + encodeURIComponent(location);
    console.log("Requesting: " + url);

    const response = await fetch(url);
    console.log("Status: " + response.status);

    // receive: parse the JSON response and print data
    const forecast = await response.json();

    console.log("");
    console.log("Right now: " + forecast.current.temperature_2m + "F, " +
        forecast.current.weather_description);

    console.log("");
    console.log("Next 7 days:");
    for (let i = 0; i < 7; i++) {
        console.log("  " + forecast.daily.time[i] + "  " +
            forecast.daily.temperature_2m_min[i] + " - " +
            forecast.daily.temperature_2m_max[i] + "F  " +
            forecast.daily.weather_description[i]);
    }
}

main();

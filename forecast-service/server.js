import express from 'express';
const app = express();
const PORT = 3333;

function getWeatherDescription(code) {
    const descriptions = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Freezing fog",
        51: "Light drizzle",
        53: "Moderate drizzle",
        55: "Heavy drizzle",
        56: "Light freezing drizzle",
        57: "Heavy freezing drizzle",
        61: "Light rain",
        63: "Moderate rain",
        65: "Heavy rain",
        66: "Light freezing rain",
        67: "Heavy freezing rain",
        71: "Light snow",
        73: "Moderate snow",
        75: "Heavy snow",
        77: "Snow grains",
        80: "Light rain showers",
        81: "Moderate rain showers",
        82: "Heavy rain showers",
        85: "Light snow showers",
        86: "Heavy snow showers",
        95: "Thunderstorm",
        96: "Thunderstorm with light hail",
        99: "Thunderstorm with heavy hail"
    };

    return descriptions[code] ?? "Unknown weather";
}

export async function getCoordinates(searchLocation) {
    const parameters = new URLSearchParams({
        name: searchLocation,
        count: "1",
        format: "json"
    });

    const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?${parameters}`
    )

    if (!response.ok){
        throw new Error("Coordinates Search Failed.")
    }

    const data = await response.json();
    if (!data.results || data.results.length === 0) {
        throw new Error("Could not find Coordinate Data.");
    }
    const geoData = data.results[0];
    return geoData;
}

export async function getForecast(latitude, longitude) {
    const parameters = new URLSearchParams({
        latitude: latitude,
        longitude: longitude,
        daily: [
            "weather_code", 
            "temperature_2m_max", 
            "temperature_2m_min", 
            "sunrise", 
            "sunset", 
            "precipitation_probability_max"
        ],
	    hourly: ["temperature_2m", 
            "apparent_temperature", 
            "precipitation_probability", 
            "precipitation", 
            "rain", 
            "weather_code", 
            "relative_humidity_2m"
        ],
	    current: ["temperature_2m", 
            "relative_humidity_2m", 
            "apparent_temperature", 
            "weather_code", 
            "precipitation"
        ],
	    forecast_days: 14,
        timezone: "auto",
        temperature_unit: "fahrenheit"
    });

    const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?${parameters}`
    );

    if (!response.ok) {
        throw new Error("Forecast Search failed.");
    }

    const data = await response.json();

    if (!data){
        throw new Error("Forecast Not Found.");
    }

    return data;
}

export async function getWeatherForecast(searchLocation) {
    const geoData = await getCoordinates(searchLocation);
    const forecast = await getForecast(geoData.latitude, geoData.longitude);

    //console.log(forecast);
    return forecast

}

app.get('/forecast', async (req,res) => {
    const location = req.query.location;
    const result = await getWeatherForecast(location);

    // const current = result.current;
    // const hourly = result.hourly;
    // const daily = result.daily;

    const forecast = {
        current_units: result.current_units,
        current: {
            ...result.current,
            weather_description: getWeatherDescription(result.current.weather_code)
        },

        hourly_units: result.hourly_units,
        hourly: {
            ...result.hourly,
            weather_description: result.hourly.weather_code.map(getWeatherDescription)
        },

        daily_units: result.daily_units,
        daily: {
            ...result.daily,
            weather_description: result.daily.weather_code.map(getWeatherDescription)
        }
    }
    
    console.log(forecast);
    res.json(forecast);
});

app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    }
);

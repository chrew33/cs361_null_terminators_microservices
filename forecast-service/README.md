# Weather Microservice (Open-Meteo):

HTTP microservice that returns weather data for a city using the Open-Meteo API.

# A) What this microservice does

Given a location string, the service:
  1. Geocodes the location to latitude/longitude using the Open-Meteo geocoding API.
  2. Fetches the forecast for those coordinates from the Open-Meteo forecast API.
  3. Translates the weather code into a readable description.
  4. Returns one JSON object containing current conditions, hourly forecast, daily forecast, etc.


# B) How to Request Data

GET http://localhost:3333/forecast?location=<city name>

### Example request using JavaScript
 
```javascript
const location = "Corvallis";
const url = "http://localhost:3333/forecast?location=" + encodeURIComponent(location);
 
const response = await fetch(url);
const forecast = await response.json();
```
To access different parts of the forecast you do any of the following:  
  return data.current  
  return data.hourly  
  return data.daily  

or for the entire forecast just  
  return data

# C) How to Receive Data

The service replies with HTTP 200 and Content-Type: application/json.

### Example JSON response

```jsonc
{
  "current_units": { "time": "iso8601", "temperature_2m": "°F", "relative_humidity_2m": "%", "apparent_temperature": "°F", "weather_code": "wmo code", "precipitation": "inch" },
  "current": {
    "time": "2026-08-01T14:00",
    "interval": 900,
    "temperature_2m": 78.4,
    "relative_humidity_2m": 45,
    "apparent_temperature": 76.1,
    "weather_code": 1,
    "precipitation": 0.0,
    "weather_description": "Mainly clear"
  },
 
  "hourly_units": { "time": "iso8601", "temperature_2m": "°F", "...": "..." },
  "hourly": {
    "time": ["2026-08-01T00:00", "..."],         
    "temperature_2m": [61.3, "..."],
    "apparent_temperature": [59.8, "..."],
    "precipitation_probability": [0, "..."],
    "precipitation": [0.0, "..."],
    "rain": [0.0, "..."],
    "relative_humidity_2m": [72, "..."],
    "weather_code": [0, "..."],
    "weather_description": ["Clear sky", "..."]
  },
 
  "daily_units": { "time": "iso8601", "temperature_2m_max": "°F", "...": "..." },
  "daily": {
    "time": ["2026-08-01", "..."],               
    "weather_code": [1, "..."],
    "temperature_2m_max": [84.2, "..."],
    "temperature_2m_min": [55.9, "..."],
    "sunrise": ["2026-08-01T06:03", "..."],
    "sunset": ["2026-08-01T20:36", "..."],
    "precipitation_probability_max": [10, "..."],
    "weather_description": ["Mainly clear", "..."]
  }
}
```

# D) UML Sequence Diagram

<img width="2760" height="1600" alt="weather_microservice_uml_sequence_diagram_black_and_white" src="https://github.com/user-attachments/assets/204a7e88-86af-43df-8937-cd4ac8220b3e" />

# Favorites Lookup & ISBN Microservice

A microservice built with Node.js and Express that provides ISBN book lookups via the Open Library API and persistent local storage for managing user favorites (books, workouts, cities)

## Features
- **ISBN Book Lookup:** Queries the Open Library API to fetch title, author, and cover image links
- **Persistent Favorites Storage:** Saves and loads favorite items locally so they persist across application restarts

---

## Getting Started

### Prerequisites
- Node.js installed on your system.

### Installation
1. Clone or place this service folder in your project directory.
2. Install dependencies:
   ```bash
   npm install




Running the Service
Start the microservice server:

Bash
node app.js
The server will run on port 6070 by default 

API Endpoints
1. ISBN Book Lookup
Fetches metadata for a given book using its ISBN.

URL: /lookup/isbn/:isbn

Method: GET

URL Params: isbn (e.g., 9780743273565)

Example Request:

Bash
curl http://localhost:6070/lookup/isbn/9780743273565
Success Response (200 OK):

JSON
{
  "success": true,
  "book": {
    "isbn": "9780743273565",
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "coverImage": "[https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg](https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg)"
  }
}





Error Response (404 Not Found):

JSON
{
  "success": false,
  "message": "Book couldn't be found with that ISBN."
}




##2. Save a Favorite Item
Saves a new favorite item (supports books, workouts, cities, or custom objects) to local persistent storage.

URL: /favorites

Method: POST

Headers: Content-Type: application/json




Example Request:

Bash
curl -X POST http://localhost:6070/favorites \
  -H "Content-Type: application/json" \
  -d '{"type": "workout", "name": "Heavy Bench & Incline Treadmill"}'
Success Response (201 Created):

JSON
{
  "success": true,
  "message": "Favorite saved successfully!",
  "favorites": [
    {
      "type": "workout",
      "name": "Heavy Bench & Incline Treadmill"
    }
  ]
}




##3. Load All Favorites
Retrieves all saved favorite items from local storage.

URL: /favorites

Method: GET



Example Request:

Bash
curl http://localhost:6070/favorites
Success Response (200 OK):

JSON
{
  "success": true,
  "favorites": [
    {
      "type": "workout",
      "name": "Heavy Bench & Incline Treadmill"
    }
  ]
}
const express = require("express");
const app = express();
const PORT = 5001;

// create the database that will hold name of image and website
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./images.db");

// Create table Images that will hold image name and website information
db.serialize(() => {
  db.run(
    `
    CREATE TABLE IF NOT EXISTS Images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    query_name TEXT NOT NULL UNIQUE,
    website_url TEXT NOT NULL)
    `
  );
});

// Enable JSON middleware
app.use(express.json());

// Root endpoint to check service status
app.get("/", (req, res) => {
  res.json({
    status: "online",
    service: "Image Return Microservice (Node.js)",
  });
});

// Primary HTTP GET endpoint
app.get("/api/image", (req, res) => {
  const query = req.query.q;

  // Validation check
  if (!query) {
    return res.status(400).json({
      status: "error",
      message: "Missing required query parameter 'q'",
    });
  }

  db.get(
    `SELECT query_name, website_url FROM Images WHERE query_name = ?`,
    [query],
    (error, row) => {
      // this is when we do have the query_name and website_url pair
      if (row){
        const responseData = {
          status: "success",
          query: query,
          image_url: row.website_url,
          source: "Image Service API",
        };
        return res.status(200).json(responseData);
      }

      else {
      // this is when we don't have an existing query_name + website_url pair (it will send a generic placeholder image)
        const formattedQuery = encodeURIComponent(query);
        const responseData = {
            status: "resource not found",
            query: query,
            image_url: `https://loremflickr.com/300/400/${formattedQuery}`,
          };
        return res.status(404).json(responseData);
      }
    }
  )
});


// HTTP POST enpoint (to allow developer to upload a query_name + website pair)
app.post("/api/image", (req, res) => {
  const {query_name, website_url} = req.body;

  if (!query_name || !website_url){
    return res.status(400).json({
      status: "error",
      message: "Both query_name and website_url are required"
    });
  }

  db.run(
    `
    INSERT INTO Images (query_name, website_url)
    VALUES (?, ?)
    `,
    [query_name, website_url],
    (error) => {
      if (error) {
        return res.status(500).json(
          {
            status: "error",
            message: "Failed to save image. Check your query_name and website_url. Also, Check if this already exists.",
          });
      }
      else{
        return res.status(201).json(
          {
            status: "success",
            message: "query_name and website_url pair created!",  
          });
      }
    });
});

// Start listening on port 5001
app.listen(PORT, () => {
  console.log(`Microservice running at http://localhost:${PORT}`);
});

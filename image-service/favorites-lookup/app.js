const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 6070;

app.use(express.json());

// Path for storing local favorites data persistently
const STORAGE_FILE = path.join(__dirname, "favorites.json");

// Helper to read favorites
const readFavorites = () => {
  if (!fs.existsSync(STORAGE_FILE)) return [];
  try {
    const data = fs.readFileSync(STORAGE_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

// Helper to write favorites
const writeFavorites = (data) => {
  fs.writeFileSync(STORAGE_FILE, JSON.stringify(data, null, 2));
};

// 1. ISBN Lookup Endpoint (Powered by Open Library API)
app.get("/lookup/isbn/:isbn", async (req, res) => {
  const isbn = req.params.isbn;
  try {
    // Open Library API endpoint for ISBNs
    const response = await fetch(`https://openlibrary.org/isbn/${isbn}.json`);

    if (!response.ok) {
      return res.status(404).json({
        success: false,
        message: "Book couldn't be found with that ISBN.",
      });
    }

    const bookData = await response.json();

    // Extract title and author keys
    const title = bookData.title || "Unknown Title";
    let authorName = "Unknown Author";

    // Open Library references authors via key; fetch author details if available
    if (bookData.authors && bookData.authors.length > 0) {
      const authorRef = bookData.authors[0].key;
      const authorResponse = await fetch(
        `https://openlibrary.org${authorRef}.json`,
      );
      if (authorResponse.ok) {
        const authorData = await authorResponse.json();
        authorName = authorData.name || authorName;
      }
    }

    // Construct cover picture link using Open Library Covers API
    const coverUrl = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;

    res.json({
      success: true,
      book: {
        isbn: isbn,
        title: title,
        author: authorName,
        coverImage: coverUrl,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error occurred while looking up the ISBN.",
    });
  }
});

// 2. Save a Favorite Item Endpoint (Works for books, workouts, cities, etc.)
app.post("/favorites", (req, res) => {
  const newItem = req.body;

  if (!newItem || Object.keys(newItem).length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "Item data is required." });
  }

  const favorites = readFavorites();
  favorites.push(newItem);
  writeFavorites(favorites);

  res.status(201).json({
    success: true,
    message: "Favorite saved successfully!",
    favorites,
  });
});

// 3. Load All Favorites Endpoint
app.get("/favorites", (req, res) => {
  const favorites = readFavorites();
  res.json({ success: true, favorites });
});

app.listen(PORT, () => {
  console.log(`Favorites Lookup service running on port ${PORT}`);
});

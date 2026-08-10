document.addEventListener("DOMContentLoaded", () => {
  fetchFavorites();
  fetchWeather("Portland"); // Default load
  fetchQuote();
  fetchImage();

  // Search bar event listener
  const searchBtn = document.getElementById("searchBtn");
  const searchInput = document.getElementById("searchInput");

  searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (!query) return;

    // Check if query looks like an ISBN (numbers/dashes)
    const isIsbn = /^[0-9-X]{10,13}$/i.test(query.replace(/-/g, ""));

    if (isIsbn) {
      fetchBookByISBN(query);
    } else {
      fetchWeather(query);
    }
  });

  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchBtn.click();
    }
  });
});

// 1. Fetch Favorites
async function fetchFavorites() {
  const container = document.getElementById("favorites-content");
  try {
    const response = await fetch("http://localhost:6070/favorites");
    const data = await response.json();
    if (data.success && data.favorites.length > 0) {
      let html = "<ul>";
      data.favorites.forEach((fav) => {
        html += `<li><strong>${fav.type.toUpperCase()}</strong>: ${
          fav.name
        }</li>`;
      });
      html += "</ul>";
      container.innerHTML = html;
    } else {
      container.innerHTML = "<p>No favorites found.</p>";
    }
  } catch (err) {
    container.innerHTML =
      "<p style='color: #f87171;'>Failed to load favorites.</p>";
  }
}

// 2. Fetch Weather with Dynamic City Parameter
async function fetchWeather(location) {
  const container = document.getElementById("weather-content");
  container.innerHTML = "<p>Loading weather...</p>";
  try {
    const response = await fetch(
      `http://localhost:3333/forecast?location=${encodeURIComponent(location)}`,
    );
    const data = await response.json();
    if (data && data.current) {
      container.innerHTML = `
                <p><strong>Location:</strong> ${data.location || location}</p>
                <p><strong>Temperature:</strong> ${
                  data.current.temperature_2m
                } °F</p>
                <p><strong>Condition:</strong> ${
                  data.current.weather_description || "Clear"
                }</p>
            `;
    } else {
      container.innerHTML = `<p>Weather data unavailable for "${location}".</p>`;
    }
  } catch (err) {
    container.innerHTML =
      "<p style='color: #f87171;'>Failed to load weather service.</p>";
  }
}

// 3. Fetch Quote
async function fetchQuote() {
  const container = document.getElementById("quote-content");
  try {
    const response = await fetch("http://localhost:5010/quote");
    const data = await response.json();
    if (response.ok) {
      container.innerHTML = `
                <div class="quote-text">"${data.quote}"</div>
                <div class="quote-author">— ${data.author}</div>
            `;
    } else {
      container.innerHTML = "<p>No quotes available.</p>";
    }
  } catch (err) {
    container.innerHTML =
      "<p style='color: #f87171;'>Failed to load quote.</p>";
  }
}

// 4. Fetch Image
async function fetchImage() {
  const container = document.getElementById("image-content");
  try {
    const response = await fetch("http://localhost:5001/api/image?q=workout");
    const data = await response.json();
    if (data && data.image_url) {
      container.innerHTML = `<img src="${data.image_url}" alt="Dashboard Visual" class="dashboard-image">`;
    } else {
      container.innerHTML = "<p>Image not found.</p>";
    }
  } catch (err) {
    container.innerHTML =
      "<p style='color: #f87171;'>Failed to load image.</p>";
  }
}

// 5. Lookup a book by ISBN via Open Library API
async function fetchBookByISBN(isbn) {
  const container = document.getElementById("book-content"); // <--- Targets the new dedicated card
  container.innerHTML = `<p>Searching for book ISBN: ${isbn}...</p>`;

  try {
    const response = await fetch(
      `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`,
    );
    const data = await response.json();
    const bookKey = `ISBN:${isbn}`;

    if (data[bookKey]) {
      const book = data[bookKey];
      const title = book.title || "Unknown Title";
      const authors = book.authors
        ? book.authors.map((a) => a.name).join(", ")
        : "Unknown Author";
      // Use large cover if available, fallback to medium
      const coverUrl = book.cover ? (book.cover.large || book.cover.medium) : "";

      container.innerHTML = `
                <div style="display: flex; gap: 20px; align-items: flex-start;">
                    ${
                      coverUrl
                        ? `<img src="${coverUrl}" alt="Book Cover" style="width: 100px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.3);" />`
                        : ""
                    }
                    <div style="display: flex; flex-direction: column; gap: 6px;">
                        <p style="font-size: 1.1rem; margin: 0;"><strong>📖 ${title}</strong></p>
                        <p style="margin: 0; color: #cbd5e1;"><strong>Author:</strong> ${authors}</p>
                        <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">ISBN: ${isbn}</p>
                        ${book.number_of_pages ? `<p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">Pages: ${book.number_of_pages}</p>` : ''}
                    </div>
                </div>
            `;
    } else {
      container.innerHTML = `<p style="color: #f87171;">No book found for ISBN: ${isbn}</p>`;
    }
  } catch (err) {
    container.innerHTML = `<p style="color: #f87171;">Failed to fetch book data.</p>`;
  }
}

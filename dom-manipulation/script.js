// Array of quote objects
let quotes = [];

// Function to load quotes from local storage
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
  populateCategories(); // Populate categories after loading quotes
  restoreLastFilter(); // Restore the last selected filter
}

// Function to save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Function to populate categories in the dropdown
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = new Set(quotes.map(quote => quote.category)); // Extract unique categories

  // Clear existing options (except "All Categories")
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  // Add categories to the dropdown
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// Function to filter quotes based on the selected category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  const filteredQuotes = selectedCategory === "all"
    ? quotes // Show all quotes if "All Categories" is selected
    : quotes.filter(quote => quote.category === selectedCategory);

  // Save the selected filter to local storage
  localStorage.setItem("lastSelectedFilter", selectedCategory);

  // Display the filtered quotes
  displayQuotes(filteredQuotes);
}

// Function to display quotes
function displayQuotes(quotesToDisplay) {
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = quotesToDisplay
    .map(quote => `<strong>${quote.text}</strong> <br> <em>${quote.category}</em>`)
    .join("<hr>");
}

// Function to restore the last selected filter
function restoreLastFilter() {
  const lastSelectedFilter = localStorage.getItem("lastSelectedFilter");
  if (lastSelectedFilter) {
    document.getElementById("categoryFilter").value = lastSelectedFilter;
    filterQuotes(); // Apply the filter
  }
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;

  if (newQuoteText && newQuoteCategory) {
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    saveQuotes(); // Save quotes to local storage
    populateCategories(); // Update the category dropdown
    postQuoteToServer(newQuote); // Post the new quote to the server
    alert("Quote added successfully!");
    filterQuotes(); // Refresh the displayed quotes
  } else {
    alert("Please fill in both fields.");
  }
}

// Function to post a new quote to the server
async function postQuoteToServer(quote) {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST", // Use POST method
      headers: {
        "Content-Type": "application/json", // Set content type to JSON
      },
      body: JSON.stringify(quote), // Send the quote as JSON
    });

    if (!response.ok) {
      throw new Error("Failed to post quote to server");
    }

    const data = await response.json();
    console.log("Quote posted to server:", data);
  } catch (error) {
    console.error("Error posting quote to server:", error);
  }
}

// Function to export quotes to a JSON file
function exportQuotes() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes(); // Save imported quotes to local storage
    populateCategories(); // Update the category dropdown
    alert("Quotes imported successfully!");
    filterQuotes(); // Refresh the displayed quotes
  };
  fileReader.readAsText(event.target.files[0]);
}

// Function to fetch quotes from the server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const serverQuotes = await response.json();
    return serverQuotes.map(post => ({ text: post.title, category: "Server" }));
  } catch (error) {
    console.error("Error fetching quotes from server:", error);
    return [];
  }
}

// Function to sync local data with server data
async function syncData() {
  const serverQuotes = await fetchQuotesFromServer();
  const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

  // Merge server and local quotes (server data takes precedence)
  const mergedQuotes = [...localQuotes, ...serverQuotes];
  const uniqueQuotes = Array.from(new Set(mergedQuotes.map(quote => quote.text)))
    .map(text => mergedQuotes.find(quote => quote.text === text));

  // Update local storage with merged quotes
  localStorage.setItem("quotes", JSON.stringify(uniqueQuotes));
  quotes = uniqueQuotes;
  populateCategories(); // Update the category dropdown
  filterQuotes(); // Refresh the displayed quotes

  // Notify the user
  alert("Data synced with server successfully!");
}

// Function to handle manual conflict resolution
function resolveConflicts() {
  const userChoice = confirm("A conflict was detected. Do you want to keep local changes?");
  if (userChoice) {
    // Keep local changes
    alert("Local changes preserved.");
  } else {
    // Sync with server data
    syncData();
  }
}

// Event listener for the "Show New Quote" button
document.getElementById("newQuote").addEventListener("click", () => {
  const selectedCategory = document.getElementById("categoryFilter").value;
  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(quote => quote.category === selectedCategory);
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];
  document.getElementById("quoteDisplay").innerHTML = `<strong>${randomQuote.text}</strong> <br> <em>${randomQuote.category}</em>`;
});

// Event listener for the "Export Quotes" button
document.getElementById("exportQuotes").addEventListener("click", exportQuotes);

// Event listener for the "Sync Data" button
document.getElementById("syncData").addEventListener("click", syncData);

// Event listener for the "Resolve Conflicts" button
document.getElementById("resolveConflicts").addEventListener("click", resolveConflicts);

// Load quotes from local storage when the page loads
loadQuotes();

// Periodically sync data with the server (every 5 minutes)
setInterval(syncData, 5 * 60 * 1000);

// Create the "Add Quote" form dynamically
createAddQuoteForm();
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
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    saveQuotes(); // Save quotes to local storage
    populateCategories(); // Update the category dropdown
    alert("Quote added successfully!");
    filterQuotes(); // Refresh the displayed quotes
  } else {
    alert("Please fill in both fields.");
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

// Load quotes from local storage when the page loads
loadQuotes();

// Create the "Add Quote" form dynamically
createAddQuoteForm();
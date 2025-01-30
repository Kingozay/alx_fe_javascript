// Array of quote objects
let quotes = [];

// Function to load quotes from local storage
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

// Function to save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Function to display a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  quoteDisplay.innerHTML = `<strong>${randomQuote.text}</strong> <br> <em>${randomQuote.category}</em>`;

  // Save the last viewed quote in session storage (optional)
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(randomQuote));
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
    alert("Quote added successfully!");
    showRandomQuote(); // Refresh the displayed quote
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
    alert("Quotes imported successfully!");
    showRandomQuote(); // Refresh the displayed quote
  };
  fileReader.readAsText(event.target.files[0]);
}

// Event listener for the "Show New Quote" button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Event listener for the "Export Quotes" button
document.getElementById("exportQuotes").addEventListener("click", exportQuotes);

// Load quotes from local storage when the page loads
loadQuotes();

// Display a random quote when the page loads
showRandomQuote();

// Create the "Add Quote" form dynamically
createAddQuoteForm();
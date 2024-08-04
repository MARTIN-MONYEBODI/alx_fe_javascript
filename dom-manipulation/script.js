let quotes = [];

// Load quotes from local storage if available
function loadQuotes() {
    const savedQuotes = localStorage.getItem('quotes');
    if (savedQuotes) {
        quotes = JSON.parse(savedQuotes);
    } else {
        // Default quotes if no local storage found
        quotes = [
            { text: "He who has a WHY to live for can bear almost any HOW.", category: "Motivation" },
            { text: "You cannot control what happens to you in life, but you can always control what you will feel and do about what happens to you.", category: "Philosophical" }
        ];
        saveQuotes();
    }
}

// Save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to display a random quote
function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    if (quotes.length === 0) {
        quoteDisplay.textContent = "No quotes available.";
        return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    quoteDisplay.textContent = `"${randomQuote.text}" - ${randomQuote.category}`;
    sessionStorage.setItem('lastQuote', JSON.stringify(randomQuote));
}

// Function to add a new quote
function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;

    if (newQuoteText === "" || newQuoteCategory === "") {
        alert("Please enter both a quote and a category.");
        return;
    }

    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);
    saveQuotes();

    // Clear the input fields
    document.getElementById('newQuoteText').value = "";
    document.getElementById('newQuoteCategory').value = "";

    // Update the quote list in the DOM
    updateQuoteList();

    alert("New quote added successfully!");
}

// Update the quote list in the DOM
function updateQuoteList() {
    const quoteListContainer = document.getElementById('quoteList');
    quoteListContainer.innerHTML = ''; // Clear existing content

    quotes.forEach(quote => {
        const quoteItem = document.createElement('div');
        quoteItem.textContent = `"${quote.text}" - ${quote.category}`;
        quoteListContainer.appendChild(quoteItem);
    });
}

// Function to export quotes to JSON file
function exportQuotes() {
    const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.textContent = "Export Quotes"; // Ensure the button label is "Export Quotes"
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Function to import quotes from JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        updateQuoteList();
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}

// Initialize the quote list on page load
function initializeQuoteList() {
    loadQuotes();
    updateQuoteList();
}

// Event listeners
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('addQuoteButton').addEventListener('click', addQuote);
document.getElementById('exportQuotes').addEventListener('click', exportQuotes);
document.getElementById('importFile').addEventListener('change', importFromJsonFile);

// Initialize the quote list when the page loads
initializeQuoteList();

// Display last viewed quote on page load if available
window.onload = function() {
    const lastQuote = sessionStorage.getItem('lastQuote');
    if (lastQuote) {
        const quoteDisplay = document.getElementById('quoteDisplay');
        const quote = JSON.parse(lastQuote);
        quoteDisplay.textContent = `"${quote.text}" - ${quote.category}`;
    }
};
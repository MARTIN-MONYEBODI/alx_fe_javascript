let quotes = [];
let categories = new Set();
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

// Load quotes and categories from local storage if available
function loadQuotes() {
    const savedQuotes = localStorage.getItem('quotes');
    if (savedQuotes) {
        quotes = JSON.parse(savedQuotes);
        quotes.forEach(quote => categories.add(quote.category));
    } else {
        quotes = [];
    }
}

// Save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Populate categories in the dropdown
function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    categoryFilter.innerHTML = '<option value="all">All Categories</option>'; // Reset categories

    const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];

    uniqueCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    const selectedCategory = localStorage.getItem('selectedCategory');
    if (selectedCategory) {
        categoryFilter.value = selectedCategory;
    }
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
    categories.add(newQuoteCategory);
    saveQuotes();
    populateCategories();
    updateQuoteList();

    alert("New quote added successfully!");

    syncWithServer(); // Sync with the server after adding a new quote
}

// Update the quote list in the DOM
function updateQuoteList(filteredQuotes = quotes) {
    const quoteListContainer = document.getElementById('quoteList');
    quoteListContainer.innerHTML = ''; // Clear existing content

    filteredQuotes.forEach(quote => {
        const quoteItem = document.createElement('div');
        quoteItem.textContent = `"${quote.text}" - ${quote.category}`;
        quoteListContainer.appendChild(quoteItem);
    });
}

// Function to filter quotes based on selected category
function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    localStorage.setItem('selectedCategory', selectedCategory);

    if (selectedCategory === 'all') {
        updateQuoteList(quotes);
    } else {
        const filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
        updateQuoteList(filteredQuotes);
    }
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
        importedQuotes.forEach(quote => {
            quotes.push(quote);
            categories.add(quote.category);
        });
        saveQuotes();
        populateCategories();
        updateQuoteList();
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}

// Initialize the quote list on page load
function initializeQuoteList() {
    loadQuotes();
    populateCategories();
    updateQuoteList();
    syncWithServer(); // Sync with the server when the page loads
}

// Function to fetch quotes from the server
async function fetchQuotesFromServer() {
    try {
        const response = await fetch(SERVER_URL);
        const serverQuotes = await response.json();

        // Merge server quotes with local quotes
        const newQuotes = serverQuotes.filter(sq => !quotes.some(lq => lq.text === sq.text));
        quotes.push(...newQuotes);
        newQuotes.forEach(quote => categories.add(quote.category));
        saveQuotes();
        populateCategories();
        updateQuoteList();
    } catch (error) {
        console.error('Error fetching quotes from server:', error);
    }
}

// Function to sync quotes with the server
async function syncWithServer() {
    await fetchQuotesFromServer();

    // Optionally, you can implement periodic sync
    setInterval(async () => {
        await fetchQuotesFromServer();
    }, 60000); // Sync every 60 seconds
}

// Function to display last viewed quote on page load if available
window.onload = function() {
    const lastQuote = sessionStorage.getItem('lastQuote');
    if (lastQuote) {
        const quoteDisplay = document.getElementById('quoteDisplay');
        const quote = JSON.parse(lastQuote);
        quoteDisplay.textContent = `"${quote.text}" - ${quote.category}`;
    }
};

// Event listeners
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('addQuoteButton').addEventListener('click', addQuote);
document.getElementById('exportQuotes').addEventListener('click', exportQuotes);
document.getElementById('importFile').addEventListener('change', importFromJsonFile);

// Initialize the quote list when the page loads
initializeQuoteList();
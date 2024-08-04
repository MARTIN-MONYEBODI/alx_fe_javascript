let quotes = [
    {text: "He who has a WHY to live for can bear almost any HOW.", category: "Motivation"},
    {text: "You cannot control what happens to you in life, but you can always control what you will feel and do about what happens to you", category: "Philosophical"},
];

// Event listener for button interaction
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

//function to display a random quote
function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = quotes.length ? ' ' : "No quotes";

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    quoteDisplay.innerHTML = `"${randomQuote.text}" - ${randomQuote.category}`;

}

// function to to add new quotes
function createAddQuoteForm() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;
    
    if (newQuoteText === "" || newQuoteCategory === "") {
        alert("Please enter both a quote and a category.");
        return;
    }
    
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);
    
    document.getElementById('newQuoteText').value = "";
    document.getElementById('newQuoteCategory').value = "";
    
    alert("New quote added successfully!");
}


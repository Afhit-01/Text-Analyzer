// DOM Elements
const textInput = document.getElementById('text-input');
const includeSpacesToggle = document.getElementById('include-spaces');
const themeToggle = document.getElementById('theme-toggle');
const editLimitBtn = document.getElementById('edit-limit');
const charLimitElement = document.getElementById('char-limit');
const charWarning = document.getElementById('char-warning');

// Stat elements
const charCountElement = document.getElementById('char-count');
const wordCountElement = document.getElementById('word-count');
const sentenceCountElement = document.getElementById('sentence-count');
const readingTimeElement = document.getElementById('reading-time');
const letterDensityElement = document.getElementById('letter-density');

// App state
let charLimit = 1000;
let includeSpaces = true;
let currentTheme = 'light';

// Initialize the app
function init() {
    // Set initial theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon();
    
    // Set initial character limit
    charLimitElement.textContent = charLimit;
    textInput.setAttribute('maxlength', charLimit);
    
    // Add event listeners
    textInput.addEventListener('input', updateStats);
    includeSpacesToggle.addEventListener('change', toggleSpaces);
    themeToggle.addEventListener('click', toggleTheme);
    editLimitBtn.addEventListener('click', editCharLimit);
    
    // Add keyboard navigation
    document.addEventListener('keydown', handleKeyboardNav);
    
    // Initialize stats
    updateStats();
}

// Update all statistics based on text input
function updateStats() {
    const text = textInput.value;
    
    // Character count
    let charCount = includeSpaces ? text.length : text.replace(/\s/g, '').length;
    charCountElement.textContent = charCount.toLocaleString();
    
    // Word count
    const words = text.trim() ? text.trim().split(/\s+/) : [];
    wordCountElement.textContent = words.length.toLocaleString();
    
    // Sentence count
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    sentenceCountElement.textContent = sentences.length.toLocaleString();
    
    // Reading time (assuming 200 words per minute)
    const readingTime = words.length / 200;
    readingTimeElement.textContent = readingTime.toFixed(1);
    
    // Check character limit
    checkCharLimit(text.length);
    
    // Update letter density
    updateLetterDensity(text);
}

// Toggle include spaces
function toggleSpaces() {
    includeSpaces = includeSpacesToggle.checked;
    updateStats();
}

// Toggle theme
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon();
}

// Update theme icon based on current theme
function updateThemeIcon() {
    const icon = themeToggle.querySelector('i');
    if (currentTheme === 'light') {
        icon.className = 'fas fa-moon';
    } else {
        icon.className = 'fas fa-sun';
    }
}

// Edit character limit
function editCharLimit() {
    const newLimit = prompt('Enter new character limit:', charLimit);
    if (newLimit && !isNaN(newLimit) && newLimit > 0) {
        charLimit = parseInt(newLimit);
        charLimitElement.textContent = charLimit;
        textInput.setAttribute('maxlength', charLimit);
        updateStats();
    }
}

// Check if character limit is exceeded
function checkCharLimit(currentChars) {
    if (currentChars > charLimit) {
        charWarning.classList.add('show');
        charCountElement.style.color = 'var(--warning-color)';
    } else {
        charWarning.classList.remove('show');
        charCountElement.style.color = 'var(--primary-color)';
    }
}

// Update letter density display
function updateLetterDensity(text) {
    // Clear previous content
    letterDensityElement.innerHTML = '';
    
    // Count letter frequencies (case insensitive)
    const letterCounts = {};
    const cleanText = text.replace(/[^a-zA-Z]/g, '').toLowerCase();
    
    for (let char of cleanText) {
        letterCounts[char] = (letterCounts[char] || 0) + 1;
    }
    
    // Sort letters by frequency (descending)
    const sortedLetters = Object.keys(letterCounts).sort((a, b) => letterCounts[b] - letterCounts[a]);
    
    // Display top 12 letters or all if less than 12
    const displayLetters = sortedLetters.slice(0, 12);
    
    if (displayLetters.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.textContent = 'No letters to analyze';
        emptyMsg.style.gridColumn = '1 / -1';
        emptyMsg.style.textAlign = 'center';
        emptyMsg.style.opacity = '0.7';
        letterDensityElement.appendChild(emptyMsg);
        return;
    }
    
    // Create density items
    displayLetters.forEach(letter => {
        const densityItem = document.createElement('div');
        densityItem.className = 'density-item';
        
        const letterElement = document.createElement('div');
        letterElement.className = 'density-letter';
        letterElement.textContent = letter.toUpperCase();
        
        const countElement = document.createElement('div');
        countElement.className = 'density-count';
        countElement.textContent = letterCounts[letter];
        
        densityItem.appendChild(letterElement);
        densityItem.appendChild(countElement);
        letterDensityElement.appendChild(densityItem);
    });
}

// Handle keyboard navigation
function handleKeyboardNav(e) {
    // Add visual indicator for keyboard navigation
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
    
    // Escape key to close modals or return focus (if we had any)
    if (e.key === 'Escape') {
        document.activeElement.blur();
    }
    
    // Theme toggle with keyboard (Alt+T)
    if (e.altKey && e.key === 't') {
        e.preventDefault();
        toggleTheme();
    }
    
    // Toggle spaces with keyboard (Alt+S)
    if (e.altKey && e.key === 's') {
        e.preventDefault();
        includeSpacesToggle.checked = !includeSpacesToggle.checked;
        toggleSpaces();
    }
    
    // Edit limit with keyboard (Alt+L)
    if (e.altKey && e.key === 'l') {
        e.preventDefault();
        editCharLimit();
    }
}

// Mouse interaction removes keyboard nav indicator
document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
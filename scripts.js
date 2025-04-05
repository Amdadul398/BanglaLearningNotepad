// Initialize storage with default values if not already present
if (!localStorage.getItem('banglaDictionary')) {
    const initialWords = [
        {
            id: 1,
            bangla: 'হ্যালো',
            pronunciation: 'hello',
            english: 'Hello',
            category: 'greetings'
        },
        {
            id: 2,
            bangla: 'ধন্যবাদ',
            pronunciation: 'dhonnobad',
            english: 'Thank you',
            category: 'greetings'
        },
        {
            id: 3,
            bangla: 'পানি',
            pronunciation: 'pani',
            english: 'Water',
            category: 'food'
        }
    ];
    localStorage.setItem('banglaDictionary', JSON.stringify(initialWords));
}

if (!localStorage.getItem('banglaPhrasebook')) {
    const initialPhrases = [
        {
            id: 1,
            bangla: 'আমার নাম...',
            pronunciation: 'amar nam...',
            english: 'My name is...',
            situation: 'greeting'
        },
        {
            id: 2,
            bangla: 'আমি ভালো আছি',
            pronunciation: 'ami bhalo achi',
            english: 'I am fine',
            situation: 'greeting'
        }
    ];
    localStorage.setItem('banglaPhrasebook', JSON.stringify(initialPhrases));
}

if (!localStorage.getItem('banglaNotes')) {
    localStorage.setItem('banglaNotes', '');
}

// Load data and initialize UI
document.addEventListener('DOMContentLoaded', function() {
    loadWords();
    loadPhrases();
    loadNotes();
    updateStats();
});

// Tab switching function
function switchTab(tabId) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Deactivate all tab buttons
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show the selected tab content
    document.getElementById(tabId).classList.add('active');
    
    // Activate the clicked tab button
    document.querySelectorAll('.tab').forEach(tab => {
        if (tab.textContent.toLowerCase().includes(tabId.toLowerCase())) {
            tab.classList.add('active');
        }
    });
}

// Vocabulary functions
function loadWords() {
    const dictionary = JSON.parse(localStorage.getItem('banglaDictionary')) || [];
    const wordList = document.getElementById('word-list');
    wordList.innerHTML = '';
    
    dictionary.forEach(word => {
        const wordCard = document.createElement('div');
        wordCard.className = 'card';
        wordCard.id = `word-${word.id}`;
        wordCard.innerHTML = `
            <div class="card-content">
                <div>
                    <h3 class="bangla">${word.bangla}</h3>
                    <div class="pronunciation">${word.pronunciation}</div>
                    <div>${word.english}</div>
                    <div><span class="category-tag">${word.category}</span></div>
                </div>
                <div class="actions">
                    <button class="btn" onclick="editWord(${word.id})">Edit</button>
                    <button class="btn" onclick="deleteWord(${word.id})">Delete</button>
                </div>
            </div>
        `;
        wordList.appendChild(wordCard);
    });
}

function addWord() {
    const bangla = document.getElementById('bangla-word').value;
    const pronunciation = document.getElementById('pronunciation').value;
    const english = document.getElementById('english-translation').value;
    const category = document.getElementById('category').value;
    
    if (!bangla || !english) {
        alert('Please enter both Bangla word and English translation');
        return;
    }
    
    const dictionary = JSON.parse(localStorage.getItem('banglaDictionary')) || [];
    const newId = dictionary.length > 0 ? Math.max(...dictionary.map(word => word.id)) + 1 : 1;
    
    const newWord = {
        id: newId,
        bangla,
        pronunciation,
        english,
        category
    };
    
    dictionary.push(newWord);
    localStorage.setItem('banglaDictionary', JSON.stringify(dictionary));
    
    // Clear inputs
    document.getElementById('bangla-word').value = '';
    document.getElementById('pronunciation').value = '';
    document.getElementById('english-translation').value = '';
    
    loadWords();
    updateStats();
}

function editWord(id) {
    const dictionary = JSON.parse(localStorage.getItem('banglaDictionary')) || [];
    const word = dictionary.find(w => w.id === id);
    
    if (!word) return;
    
    const wordCard = document.getElementById(`word-${id}`);
    if (!wordCard) return;
    
    wordCard.innerHTML = `
        <div class="edit-mode">
            <input type="text" id="edit-bangla-${id}" value="${word.bangla}" placeholder="Bangla Word">
            <input type="text" id="edit-pronunciation-${id}" value="${word.pronunciation}" placeholder="Pronunciation">
            <input type="text" id="edit-english-${id}" value="${word.english}" placeholder="English Translation">
            <select id="edit-category-${id}">
                <option value="greetings" ${word.category === 'greetings' ? 'selected' : ''}>Greetings</option>
                <option value="food" ${word.category === 'food' ? 'selected' : ''}>Food</option>
                <option value="travel" ${word.category === 'travel' ? 'selected' : ''}>Travel</option>
                <option value="numbers" ${word.category === 'numbers' ? 'selected' : ''}>Numbers</option>
                <option value="colors" ${word.category === 'colors' ? 'selected' : ''}>Colors</option>
                <option value="family" ${word.category === 'family' ? 'selected' : ''}>Family</option>
                <option value="time" ${word.category === 'time' ? 'selected' : ''}>Time</option>
                <option value="other" ${word.category === 'other' ? 'selected' : ''}>Other</option>
            </select>
            <div class="actions">
                <button class="btn" onclick="saveWordEdit(${id})">Save</button>
                <button class="btn" onclick="loadWords()">Cancel</button>
            </div>
        </div>
    `;
}

function saveWordEdit(id) {
    const dictionary = JSON.parse(localStorage.getItem('banglaDictionary')) || [];
    const index = dictionary.findIndex(w => w.id === id);
    
    if (index === -1) return;
    
    dictionary[index] = {
        id,
        bangla: document.getElementById(`edit-bangla-${id}`).value,
        pronunciation: document.getElementById(`edit-pronunciation-${id}`).value,
        english: document.getElementById(`edit-english-${id}`).value,
        category: document.getElementById(`edit-category-${id}`).value
    };
    
    localStorage.setItem('banglaDictionary', JSON.stringify(dictionary));
    loadWords();
}

function deleteWord(id) {
    if (!confirm('Are you sure you want to delete this word?')) return;
    
    const dictionary = JSON.parse(localStorage.getItem('banglaDictionary')) || [];
    const filteredDictionary = dictionary.filter(word => word.id !== id);
    
    localStorage.setItem('banglaDictionary', JSON.stringify(filteredDictionary));
    loadWords();
    updateStats();
}

function filterWords() {
    const searchQuery = document.getElementById('search-words').value.toLowerCase();
    const categoryFilter = document.getElementById('filter-category').value;
    
    const dictionary = JSON.parse(localStorage.getItem('banglaDictionary')) || [];
    const wordList = document.getElementById('word-list');
    wordList.innerHTML = '';
    
    const filteredWords = dictionary.filter(word => {
        const matchesSearch = word.bangla.toLowerCase().includes(searchQuery) || 
                              word.english.toLowerCase().includes(searchQuery) ||
                              word.pronunciation.toLowerCase().includes(searchQuery);
                              
        const matchesCategory = categoryFilter === 'all' || word.category === categoryFilter;
        
        return matchesSearch && matchesCategory;
    });
    
    filteredWords.forEach(word => {
        const wordCard = document.createElement('div');
        wordCard.className = 'card';
        wordCard.id = `word-${word.id}`;
        wordCard.innerHTML = `
            <div class="card-content">
                <div>
                    <h3 class="bangla">${word.bangla}</h3>
                    <div class="pronunciation">${word.pronunciation}</div>
                    <div>${word.english}</div>
                    <div><span class="category-tag">${word.category}</span></div>
                </div>
                <div class="actions">
                    <button class="btn" onclick="editWord(${word.id})">Edit</button>
                    <button class="btn" onclick="deleteWord(${word.id})">Delete</button>
                </div>
            </div>
        `;
        wordList.appendChild(wordCard);
    });
}

// Phrasebook functions
function loadPhrases() {
    const phrasebook = JSON.parse(localStorage.getItem('banglaPhrasebook')) || [];
    const phraseList = document.getElementById('phrase-list');
    phraseList.innerHTML = '';
    
    phrasebook.forEach(phrase => {
        const phraseCard = document.createElement('div');
        phraseCard.className = 'phrase-card';
        phraseCard.id = `phrase-${phrase.id}`;
        phraseCard.innerHTML = `
            <h4 class="bangla">${phrase.bangla}</h4>
            <p class="pronunciation">${phrase.pronunciation}</p>
            <p>${phrase.english}</p>
            <div><span class="category-tag">${phrase.situation}</span></div>
            <div class="actions">
                <button class="btn" onclick="editPhrase(${phrase.id})">Edit</button>
                <button class="btn" onclick="deletePhrase(${phrase.id})">Delete</button>
            </div>
        `;
        phraseList.appendChild(phraseCard);
    });
}

function addPhrase() {
    const bangla = document.getElementById('bangla-phrase').value;
    const pronunciation = document.getElementById('phrase-pronunciation').value;
    const english = document.getElementById('phrase-translation').value;
    const situation = document.getElementById('situation').value;
    
    if (!bangla || !english) {
        alert('Please enter both Bangla phrase and English translation');
        return;
    }
    
    const phrasebook = JSON.parse(localStorage.getItem('banglaPhrasebook')) || [];
    const newId = phrasebook.length > 0 ? Math.max(...phrasebook.map(phrase => phrase.id)) + 1 : 1;
    
    const newPhrase = {
        id: newId,
        bangla,
        pronunciation,
        english,
        situation
    };
    
    phrasebook.push(newPhrase);
    localStorage.setItem('banglaPhrasebook', JSON.stringify(phrasebook));
    
    // Clear inputs
    document.getElementById('bangla-phrase').value = '';
    document.getElementById('phrase-pronunciation').value = '';
    document.getElementById('phrase-translation').value = '';
    
    loadPhrases();
    updateStats();
}

function editPhrase(id) {
    const phrasebook = JSON.parse(localStorage.getItem('banglaPhrasebook')) || [];
    const phrase = phrasebook.find(p => p.id === id);
    
    if (!phrase) return;
    
    const phraseCard = document.getElementById(`phrase-${id}`);
    if (!phraseCard) return;
    
    phraseCard.innerHTML = `
        <div class="edit-mode">
            <input type="text" id="edit-bangla-phrase-${id}" value="${phrase.bangla}" placeholder="Bangla Phrase">
            <input type="text" id="edit-phrase-pronunciation-${id}" value="${phrase.pronunciation}" placeholder="Pronunciation">
            <input type="text" id="edit-phrase-translation-${id}" value="${phrase.english}" placeholder="English Translation">
            <select id="edit-situation-${id}">
                <option value="greeting" ${phrase.situation === 'greeting' ? 'selected' : ''}>Greeting</option>
                <option value="restaurant" ${phrase.situation === 'restaurant' ? 'selected' : ''}>Restaurant</option>
                <option value="shopping" ${phrase.situation === 'shopping' ? 'selected' : ''}>Shopping</option>
                <option value="transportation" ${phrase.situation === 'transportation' ? 'selected' : ''}>Transportation</option>
                <option value="emergency" ${phrase.situation === 'emergency' ? 'selected' : ''}>Emergency</option>
                <option value="conversation" ${phrase.situation === 'conversation' ? 'selected' : ''}>Conversation</option>
                <option value="other" ${phrase.situation === 'other' ? 'selected' : ''}>Other</option>
            </select>
            <div class="actions">
                <button class="btn" onclick="savePhraseEdit(${id})">Save</button>
                <button class="btn" onclick="loadPhrases()">Cancel</button>
            </div>
        </div>
    `;
}

function savePhraseEdit(id) {
    const phrasebook = JSON.parse(localStorage.getItem('banglaPhrasebook')) || [];
    const index = phrasebook.findIndex(p => p.id === id);
    
    if (index === -1) return;
    
    phrasebook[index] = {
        id,
        bangla: document.getElementById(`edit-bangla-phrase-${id}`).value,
        pronunciation: document.getElementById(`edit-phrase-pronunciation-${id}`).value,
        english: document.getElementById(`edit-phrase-translation-${id}`).value,
        situation: document.getElementById(`edit-situation-${id}`).value
    };
    
    localStorage.setItem('banglaPhrasebook', JSON.stringify(phrasebook));
    loadPhrases();
}

function deletePhrase(id) {
    if (!confirm('Are you sure you want to delete this phrase?')) return;
    
    const phrasebook = JSON.parse(localStorage.getItem('banglaPhrasebook')) || [];
    const filteredPhrasebook = phrasebook.filter(phrase => phrase.id !== id);
    
    localStorage.setItem('banglaPhrasebook', JSON.stringify(filteredPhrasebook));
    loadPhrases();
    updateStats();
}

function filterPhrases() {
    const searchQuery = document.getElementById('search-phrases').value.toLowerCase();
    const situationFilter = document.getElementById('filter-situation').value;
    
    const phrasebook = JSON.parse(localStorage.getItem('banglaPhrasebook')) || [];
    const phraseList = document.getElementById('phrase-list');
    phraseList.innerHTML = '';
    
    const filteredPhrases = phrasebook.filter(phrase => {
        const matchesSearch = phrase.bangla.toLowerCase().includes(searchQuery) || 
                              phrase.english.toLowerCase().includes(searchQuery) ||
                              phrase.pronunciation.toLowerCase().includes(searchQuery);
                              
        const matchesSituation = situationFilter === 'all' || phrase.situation === situationFilter;
        
        return matchesSearch && matchesSituation;
    });
    
    filteredPhrases.forEach(phrase => {
        const phraseCard = document.createElement('div');
        phraseCard.className = 'phrase-card';
        phraseCard.id = `phrase-${phrase.id}`;
        phraseCard.innerHTML = `
            <h4 class="bangla">${phrase.bangla}</h4>
            <p class="pronunciation">${phrase.pronunciation}</p>
            <p>${phrase.english}</p>
            <div><span class="category-tag">${phrase.situation}</span></div>
            <div class="actions">
                <button class="btn" onclick="editPhrase(${phrase.id})">Edit</button>
                <button class="btn" onclick="deletePhrase(${phrase.id})">Delete</button>
            </div>
        `;
        phraseList.appendChild(phraseCard);
    });
}

// Notes functions
function loadNotes() {
    const notes = localStorage.getItem('banglaNotes') || '';
    document.getElementById('notes-area').value = notes;
}

function saveNotes() {
    const notes = document.getElementById('notes-area').value;
    localStorage.setItem('banglaNotes', notes);
    alert('Notes saved successfully!');
}

// Update stats
function updateStats() {
    const dictionary = JSON.parse(localStorage.getItem('banglaDictionary')) || [];
    const phrasebook = JSON.parse(localStorage.getItem('banglaPhrasebook')) || [];
    const categories = new Set(dictionary.map(word => word.category));
    
    document.getElementById('words-count').textContent = dictionary.length;
    document.getElementById('phrases-count').textContent = phrasebook.length;
    document.getElementById('categories-count').textContent = categories.size;
}
if (typeof localStorage === 'undefined') {
    global.localStorage = {
        store: {},
        getItem(key) {
            return this.store[key] || null;
        },
        setItem(key, value) {
            this.store[key] = value;
        },
        removeItem(key) {
            delete this.store[key];
        },
        clear() {
            this.store = {};
        }
    };
}


// Game configuration
const size = 4;
export let board = [];
export let currentScore = 0;
export let highScore = 0; // Default high score
export let currentScoreElem;
export let highScoreElem;
export let gameOverElem;

// Function to load high score from localStorage
function loadHighScore() {
    if (typeof localStorage !== 'undefined') {
        return localStorage.getItem('2048-highScore') || 0;
    }
    return 0; // Default if localStorage is not available
}

// Function to initialize UI elements and event listeners
export function setupUI() {
    if (typeof document !== 'undefined') {
        currentScoreElem = document.getElementById('current-score');
        highScoreElem = document.getElementById('high-score');
        gameOverElem = document.getElementById('game-over');
        
        highScore = loadHighScore(); // Load the high score here
        highScoreElem.textContent = highScore;

        // Event listeners
        document.addEventListener('keydown', event => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
                move(event.key);
            }
        });
        document.getElementById('restart-btn').addEventListener('click', restartGame);

        initialiseGame(); // Initialize the game after DOM is loaded
    }
}

// Load UI when the DOM is fully loaded
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', setupUI);
}

// Function to update the score
export function updateScore(value) {
    currentScore += value;
    if (currentScoreElem) currentScoreElem.textContent = currentScore;
    if (currentScore > highScore) {
        highScore = currentScore;
        if (highScoreElem) highScoreElem.textContent = highScore;
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('2048-highScore', highScore);
        }
    }
}

// Function to restart the game
export function restartGame() {
    currentScore = 0;
    if (currentScoreElem) currentScoreElem.textContent = '0';
    if (gameOverElem) gameOverElem.style.display = 'none';
    initialiseGame();
}

// Function to initialise the game
export function initialiseGame() {
    board = [...Array(size)].map(e => Array(size).fill(0));
    placeRandom();
    placeRandom();
    renderBoard();
}

// Function to render the game board on the UI
export function renderBoard() {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const cell = document.querySelector(`[data-row="${i}"][data-col="${j}"]`);
            const prevValue = cell?.dataset.value; // Use optional chaining
            const currentValue = board[i][j];
            if (cell) {
                if (currentValue !== 0) {
                    cell.dataset.value = currentValue;
                    cell.textContent = currentValue;
                    // Animation handling
                    if (currentValue !== parseInt(prevValue) && !cell.classList.contains('new-tile')) {
                        cell.classList.add('merged-tile');
                    }
                } else {
                    cell.textContent = '';
                    delete cell.dataset.value;
                    cell.classList.remove('merged-tile', 'new-tile');
                }
            }
        }
    }

    // Cleanup animation classes
    setTimeout(() => {
        const cells = document.querySelectorAll('.grid-cell');
        cells.forEach(cell => {
            cell.classList.remove('merged-tile', 'new-tile');
        });
    }, 300);
}

// Function to place a random tile on the board
export function placeRandom() {
    const available = [];
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j] === 0) {
                available.push({ x: i, y: j });
            }
        }
    }

    if (available.length > 0) {
        const randomCell = available[Math.floor(Math.random() * available.length)];
        board[randomCell.x][randomCell.y] = Math.random() < 0.9 ? 2 : 4;
        const cell = document.querySelector(`[data-row="${randomCell.x}"][data-col="${randomCell.y}"]`);
        if (cell) {
            cell.classList.add('new-tile'); // Animation for new tiles
        }
    }
}

// Function to move the tiles based on arrow key input
export function move(direction) {
    let hasChanged = false;
    if (direction === 'ArrowUp' || direction === 'ArrowDown') {
        for (let j = 0; j < size; j++) {
            const column = [...Array(size)].map((_, i) => board[i][j]);
            const newColumn = transform(column, direction === 'ArrowUp');
            for (let i = 0; i < size; i++) {
                if (board[i][j] !== newColumn[i]) {
                    hasChanged = true;
                    board[i][j] = newColumn[i];
                }
            }
        }
    } else if (direction === 'ArrowLeft' || direction === 'ArrowRight') {
        for (let i = 0; i < size; i++) {
            const row = board[i];
            const newRow = transform(row, direction === 'ArrowLeft');
            if (row.join(',') !== newRow.join(',')) {
                hasChanged = true;
                board[i] = newRow;
            }
        }
    }
    if (hasChanged) {
        placeRandom();
        renderBoard();
        checkGameOver();
    }
}

// Function to transform a line (row or column) based on move direction
export function transform(line, moveTowardsStart) {
    let newLine = line.filter(cell => cell !== 0);
    if (!moveTowardsStart) {
        newLine.reverse();
    }
    for (let i = 0; i < newLine.length - 1; i++) {
        if (newLine[i] === newLine[i + 1]) {
            newLine[i] *= 2;
            updateScore(newLine[i]); // Update score when tiles merged
            newLine.splice(i + 1, 1);
        }
    }
    while (newLine.length < size) {
        newLine.push(0);
    }
    if (!moveTowardsStart) {
        newLine.reverse();
    }
    return newLine;
}

// Function to check if the game is over
export function checkGameOver() {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j] === 0) {
                return; // There is an empty cell, so game not over
            }
            if (j < size - 1 && board[i][j] === board[i][j + 1]) {
                return; // There are horizontally adjacent equal cells, so a move is possible
            }
            if (i < size - 1 && board[i][j] === board[i + 1][j]) {
                return; // There are vertically adjacent equal cells, so a move is possible
            }
        }
    }

    // If we reach here, no moves are possible
    if (gameOverElem) {
        gameOverElem.style.display = 'flex';
    }
}

// Initialise the game and set up event listeners
export function startGame() {
    currentScoreElem = document.getElementById('current-score');
    highScoreElem = document.getElementById('high-score');
    gameOverElem = document.getElementById('game-over');

    highScoreElem.textContent = highScore;

    document.addEventListener('keydown', event => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
            move(event.key);
        }
    });
    
    document.getElementById('restart-btn').addEventListener('click', restartGame);
    initialiseGame();
}

// Call startGame only if document is defined
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', startGame);
}

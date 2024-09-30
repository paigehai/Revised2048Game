export function updateScore(value) {
    currentScore += value;
    currentScoreElem.textContent = currentScore;
    if (currentScore > highScore) {
        highScore = currentScore;
        highScoreElem.textContent = highScore;
        localStorage.setItem('2048-highScore', highScore);
    }
}

export function restartGame() {
    currentScore = 0;
    currentScoreElem.textContent = '0';
    gameOverElem.style.display = 'none';
    initializeGame();
}

export function initializeGame() {
    board = [...Array(size)].map(e => Array(size).fill(0));
    placeRandom();
    placeRandom();
    renderBoard();
}

export function renderBoard() {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const cell = document.querySelector(`[data-row="${i}"][data-col="${j}"]`);
            const prevValue = cell.dataset.value;
            const currentValue = board[i][j];
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
    // Cleanup animation classes
    setTimeout(() => {
        const cells = document.querySelectorAll('.grid-cell');
        cells.forEach(cell => {
            cell.classList.remove('merged-tile', 'new-tile');
        });
    }, 300);
}

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
        cell.classList.add('new-tile'); // Animation for new tiles
    }
}

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
    gameOverElem.style.display = 'flex';
}

// Then place your event listener logic
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const size = 4;
    let board = [];
    let currentScore = 0;
    const currentScoreElem = document.getElementById('current-score');
    let highScore = localStorage.getItem('2048-highScore') || 0;
    const highScoreElem = document.getElementById('high-score');
    highScoreElem.textContent = highScore;
    const gameOverElem = document.getElementById('game-over');

    document.addEventListener('keydown', event => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
            move(event.key);
        }
    });
    document.getElementById('restart-btn').addEventListener('click', restartGame);
    initializeGame();
});

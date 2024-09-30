import { JSDOM } from 'jsdom'; // Add JSDOM for mocking the DOM in Node.js
import { initializeGame, updateScore, move, checkGameOver } from '../src/script.mjs';

describe('2048 Game Tests', () => {
    let window, document;

    beforeAll(() => {
        // Set up jsdom to simulate the browser environment
        const dom = new JSDOM(`<!DOCTYPE html><html><body>
            <div id="current-score">0</div>
            <div id="high-score">0</div>
            <div id="game-over" style="display: none;"></div>
            <button id="restart-btn">Restart</button>
            <div class="grid">
                <div data-row="0" data-col="0"></div>
                <div data-row="0" data-col="1"></div>
                <div data-row="0" data-col="2"></div>
                <div data-row="0" data-col="3"></div>
                <div data-row="1" data-col="0"></div>
                <div data-row="1" data-col="1"></div>
                <div data-row="1" data-col="2"></div>
                <div data-row="1" data-col="3"></div>
                <div data-row="2" data-col="0"></div>
                <div data-row="2" data-col="1"></div>
                <div data-row="2" data-col="2"></div>
                <div data-row="2" data-col="3"></div>
                <div data-row="3" data-col="0"></div>
                <div data-row="3" data-col="1"></div>
                <div data-row="3" data-col="2"></div>
                <div data-row="3" data-col="3"></div>
            </div>
        </body></html>`);

        window = dom.window;
        document = dom.window.document;

        // Assign global document so your code can access it
        global.window = window;
        global.document = document;
        
        // Initialize the game before tests
        initializeGame();
    });

    beforeEach(() => {
        // Reset the game state or mock data before each test
        initializeGame();
    });

    test('should initialize the game', () => {
        expect(document.getElementById('current-score').textContent).toBe('0');
        expect(document.getElementById('high-score').textContent).toBe('0');
        
        // Verify the game board is initialized correctly
        const gridCells = document.querySelectorAll('.grid div');
        gridCells.forEach(cell => {
            expect(cell.textContent).toBe(''); // Assuming empty cells are rendered as empty
        });
    });

    test('should update the score correctly', () => {
        updateScore(10);
        expect(document.getElementById('current-score').textContent).toBe('10');
    });

    test('should handle restart button click', () => {
        const restartBtn = document.getElementById('restart-btn');
        restartBtn.click(); // Simulate button click

        // Validate that the current score has been reset
        expect(document.getElementById('current-score').textContent).toBe('0');

        // Optionally, check if the board has been reset
        const gridCells = document.querySelectorAll('.grid div');
        gridCells.forEach(cell => {
            expect(cell.textContent).toBe(''); // Assuming cells are reset to empty
        });
    });

    test('should move tiles correctly', () => {
        // Set a mock initial board state
        const initialBoardState = [
            [2, 2, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];

        // Directly assign the mock state to the board
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                board[i][j] = initialBoardState[i][j];
            }
        }

        // Simulate moving the tiles to the left
        move('ArrowLeft');

        // Validate the board state after the move
        expect(board[0]).toEqual([4, 0, 0, 0]);  // The merged result of [2, 2, 0, 0]
    });

    test('should check game over condition correctly', () => {
        // Set up a mock "game over" board
        const gameOverBoard = [
            [2, 4, 8, 16],
            [32, 64, 128, 256],
            [512, 1024, 2048, 4096],
            [8192, 16384, 32768, 65536]
        ];

        // Set the board state manually
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                board[i][j] = gameOverBoard[i][j];
            }
        }

        // Check if game over is detected
        checkGameOver();  // This function should alter the DOM (e.g., display the "game-over" div)
        
        // Validate that the game over condition has been applied
        expect(document.getElementById('game-over').style.display).toBe('flex');
    });
});

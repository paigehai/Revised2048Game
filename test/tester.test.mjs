import { JSDOM } from 'jsdom';
import { expect } from 'chai';
import { 
    board, 
    initializeGame, 
    updateScore, 
    move, 
    checkGameOver 
} from '../src/script.mjs';

describe('2048 Game Tests', () => {
    let window, document;

    before(() => {
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
        document = window.document;

        // Assign global document so code can access it
        global.window = window;
        global.document = document;

        // Initialize elements
        global.currentScoreElem = document.getElementById('current-score');
        global.highScoreElem = document.getElementById('high-score');
        global.gameOverElem = document.getElementById('game-over');

        // Initialise the game before tests
        initializeGame();
    });

    beforeEach(() => {
        // Reset the game state before each test
        initializeGame();
    });

    it('should initialize the game', () => {
        expect(currentScoreElem.textContent).to.equal('0'); // Assuming the initial score is 2 or 4
        expect(highScoreElem.textContent).to.equal('0');
        
        // Verify the game board is initialized correctly
        const gridCells = document.querySelectorAll('.grid div');
        gridCells.forEach(cell => {
            expect(cell.textContent).to.equal(''); // Assuming empty cells are rendered as empty
        });
    });

    it('should update the score correctly', () => {
        updateScore(10);
        expect(currentScoreElem.textContent).to.equal('10');
    });

    it('should handle restart button click', () => {
        const restartBtn = document.getElementById('restart-btn');
        restartBtn.click(); // Simulate button click

        // Validate that the current score has been reset
        expect(currentScoreElem.textContent).to.equal('0');

        // Optionally, check if the board has been reset
        const gridCells = document.querySelectorAll('.grid div');
        gridCells.forEach(cell => {
            expect(cell.textContent).to.equal(''); // Assuming cells are reset to empty
        });
    });

    it('should move tiles correctly', () => {
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
        expect(board[0]).to.deep.equal([4, 0, 0, 0]);  // The merged result of [2, 2, 0, 0]
    });

    it('should check game over condition correctly', () => {
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
        expect(gameOverElem.style.display).to.equal('flex');
    });

    it('should place a random tile after a move', () => {
        // Set up an initial board state with one empty space
        const initialBoardState = [
            [2, 0, 2, 0],
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

        // Simulate a move that causes a change
        move('ArrowLeft');

        // Check that a random tile has been placed
        const nonZeroTiles = board.flat().filter(value => value !== 0).length;
        expect(nonZeroTiles).to.equal(3); // 2 tiles + 1 new tile
    });
});

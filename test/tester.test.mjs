import { JSDOM } from 'jsdom';
import { expect } from 'chai';
import {
    initialiseGame,
    updateScore,
    move,
    checkGameOver,
    startGame
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

        // Initialise elements
        global.currentScoreElem = document.getElementById('current-score');
        global.highScoreElem = document.getElementById('high-score');
        global.gameOverElem = document.getElementById('game-over');

        startGame();

        currentScoreElem.textContent = '0';
        highScoreElem.textContent = '0';
        gameOverElem.style.display = 'none';

        // Initialise the game before tests
        initialiseGame();
    });

    beforeEach(() => {
        // Reset the game state before each test
        initialiseGame();
    });

    it('Game Initialisation Unit Test', () => {
        expect(currentScoreElem.textContent).to.equal('0');
        expect(highScoreElem.textContent).to.equal('0');

        // Verify the game board is initialised correctly
        const gridCells = document.querySelectorAll('.grid div');
        let hasTile = false;
        gridCells.forEach(cell => {
            const cellValue = cell.textContent;
            if (cellValue === '2' || cellValue === '4') {
                hasTile = true; // At least one tile is present
            }
        });
        expect(hasTile).to.be.true; // Check that there is at least one tile
    });


    it('Game Update Unit Test', () => {
        updateScore(10);
        expect(currentScoreElem.textContent).to.equal('10');
    });

    it('Mouse Button Click Unit Test', () => {
        const restartBtn = document.getElementById('restart-btn');
        restartBtn.click(); // Simulate button click

        // Validate that the current score has been reset
        expect(currentScoreElem.textContent).to.equal('0');

        // Verify the game board is initialised correctly
        const gridCells = document.querySelectorAll('.grid div');
        let hasTile = false;
        gridCells.forEach(cell => {
            const cellValue = cell.textContent;
            if (cellValue === '2' || cellValue === '4') {
                hasTile = true; // At least one tile is present
            }
        });
        expect(hasTile).to.be.true; // Check that there is at least one tile
    });

    it('Tile Movement Unit Test', () => {
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

    it('Game Over Unit Test', () => {
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

    it('Random Tile After Move Unit Test', () => {
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
        expect(nonZeroTiles).to.equal(2); // 1 merged tile, 1 new tile
    });
});

import { JSDOM } from 'jsdom';
import { expect } from 'chai';
import { 
    board, 
    restartGame, 
    move, 
    updateScore, 
    checkGameOver, 
    initialiseGame 
} from '../src/script.mjs';

global.localStorage = {
    store: {},
    getItem(key) {
        return this.store[key] || null;
    },
    setItem(key, value) {
        this.store[key] = value.toString();
    },
    removeItem(key) {
        delete this.store[key];
    },
    clear() {
        this.store = {};
    }
};

describe('2048 Game Tests', () => {
    let window, document;

    // Helper function to set up the DOM
    const setUpDOM = () => {
        const dom = new JSDOM(`<!DOCTYPE html><html><body>
            <div id="current-score">0</div>
            <div id="high-score">0</div>
            <div id="game-over" style="display: none;"></div>
            <button id="restart-btn">Restart</button>
            <div class="grid">
                ${Array.from({ length: 16 }, (_, i) => 
                    `<div data-row="${Math.floor(i / 4)}" data-col="${i % 4}"></div>`
                ).join('')}
            </div>
        </body></html>`);

        window = dom.window;
        document = window.document;

        global.window = window;
        global.document = document;

        global.currentScoreElem = document.getElementById('current-score');
        global.highScoreElem = document.getElementById('high-score');
        global.gameOverElem = document.getElementById('game-over');
    };

    // Helper function to initialize game state
    const initializeGameState = () => {
        restartGame();
        initialiseGame();
        currentScoreElem.textContent = '0';
        highScoreElem.textContent = '0';
        gameOverElem.style.display = 'none';
    };

    before(async () => {
        setUpDOM();
        initializeGameState();
    });

    beforeEach(() => {
        initialiseGame();
    });

    it('Game Initialisation Unit Test', () => {
        expect(currentScoreElem.textContent).to.equal('0');
        expect(highScoreElem.textContent).to.equal('0');

        const gridCells = document.querySelectorAll('.grid div');
        const hasTile = Array.from(gridCells).some(cell => 
            cell.textContent === '2' || cell.textContent === '4'
        );
        expect(hasTile).to.be.true;
    });

    it('Game Update Unit Test', () => {
        updateScore(10);
        expect(currentScoreElem.textContent).to.equal('10');
    });

    it('Mouse Button Click Unit Test', () => {
        const restartBtn = document.getElementById('restart-btn');
        restartBtn.click();

        expect(currentScoreElem.textContent).to.equal('0');
        const gridCells = document.querySelectorAll('.grid div');
        const hasTile = Array.from(gridCells).some(cell => 
            cell.textContent === '2' || cell.textContent === '4'
        );
        expect(hasTile).to.be.true;
    });

    it('Tile Movement Unit Test', () => {
        const initialBoardState = [
            [2, 2, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];

        board.forEach((row, i) => row.forEach((_, j) => board[i][j] = initialBoardState[i][j]));
        
        move('ArrowLeft');

        expect(board[0]).to.deep.equal([4, 0, 0, 0]);
    });

    it('Game Over Unit Test', () => {
        const gameOverBoard = [
            [2, 4, 8, 16],
            [32, 64, 128, 256],
            [512, 1024, 2048, 4096],
            [8192, 16384, 32768, 65536]
        ];

        board.forEach((row, i) => row.forEach((_, j) => board[i][j] = gameOverBoard[i][j]));
        
        checkGameOver();
        expect(gameOverElem.style.display).to.equal('flex');
    });

    it('Random Tile After Move Unit Test', () => {
        const initialBoardState = [
            [2, 0, 2, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];

        board.forEach((row, i) => row.forEach((_, j) => board[i][j] = initialBoardState[i][j]));
        
        move('ArrowLeft');

        const nonZeroTiles = board.flat().filter(value => value !== 0).length;
        expect(nonZeroTiles).to.equal(2);
    });
});

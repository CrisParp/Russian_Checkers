// Declare game state variables
let board = document.getElementById('board');
let selectedPiece = null;
let currentPlayer = 'white';  // Default starting player: White starts first
let gameTimer = null;
let startTime = null;
let timeElapsed = 0;
let isGameStarted = false;

// Toggle menu visibility
document.getElementById('menuButton').addEventListener('click', () => {
    document.getElementById('menu').classList.toggle('active');
});

// Initialize the board
function createBoard() {
    const pieces = [
        ['b', 'b', 'b', 'b', '', 'b', 'b', 'b'],
        ['b', 'b', 'b', 'b', '', 'b', 'b', 'b'],
        ['b', 'b', 'b', 'b', '', 'b', 'b', 'b'],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['w', 'w', 'w', 'w', '', 'w', 'w', 'w'],
        ['w', 'w', 'w', 'w', '', 'w', 'w', 'w'],
        ['w', 'w', 'w', 'w', '', 'w', 'w', 'w']
    ];

    board.innerHTML = ''; // Clear any existing board

    // Create the grid and add pieces
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell', (row + col) % 2 === 0 ? 'light' : 'dark');
            cell.dataset.row = row;
            cell.dataset.col = col;

            // Place pieces on dark squares
            if ((row + col) % 2 !== 0) {
                if (pieces[row][col] === 'b') {
                    const piece = document.createElement('div');
                    piece.classList.add('piece', 'black');
                    piece.dataset.row = row;
                    piece.dataset.col = col;
                    cell.appendChild(piece);
                } else if (pieces[row][col] === 'w') {
                    const piece = document.createElement('div');
                    piece.classList.add('piece', 'white');
                    piece.dataset.row = row;
                    piece.dataset.col = col;
                    cell.appendChild(piece);
                }
            }

            board.appendChild(cell);
        }
    }
}

// Handle piece selection and movement
board.addEventListener('click', (event) => {
    const target = event.target;

    // Handle piece selection
    if (target.classList.contains('piece')) {
        if (selectedPiece) {
            selectedPiece.classList.remove('selected');
        }
        selectedPiece = target;
        selectedPiece.classList.add('selected');
        highlightValidMoves(target);
    }
    // Handle piece movement
    else if (selectedPiece && target.classList.contains('cell') && target.classList.contains('dark')) {
        if (!target.hasChildNodes()) {  // Only move to empty cells
            movePiece(target);
        }
    }
    // Deselect piece if clicking elsewhere
    else {
        clearHighlights();
        selectedPiece = null;
    }
});

// Highlight valid moves for the selected piece
function highlightValidMoves(piece) {
    const isBlack = piece.classList.contains('black');
    const row = parseInt(piece.dataset.row);
    const col = parseInt(piece.dataset.col);
    const directions = isBlack ? [[1, -1], [1, 1]] : [[-1, -1], [-1, 1]];

    clearHighlights();

    directions.forEach(dir => {
        const newRow = row + dir[0];
        const newCol = col + dir[1];

        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            const targetCell = board.children[newRow * 8 + newCol];
            if (targetCell.classList.contains('dark') && !targetCell.hasChildNodes()) {
                targetCell.classList.add('valid-move');
            }
        }
    });
}

// Move the selected piece to the target cell
function movePiece(target) {
    const piece = selectedPiece;
    const targetCell = target;

    // Move the piece
    targetCell.appendChild(piece);
    piece.classList.remove('selected');
    piece.dataset.row = target.dataset.row;
    piece.dataset.col = target.dataset.col;

    // Switch player
    currentPlayer = currentPlayer === 'white' ? 'black' : 'white';

    // Update the timer and highlight turns
    updateTimer();
    clearHighlights();
    selectedPiece = null;
}

// Clear valid move highlights
function clearHighlights() {
    const cells = board.getElementsByClassName('cell');
    for (let cell of cells) {
        cell.classList.remove('valid-move');
    }
}

// Timer function
function startTimer() {
    if (!startTime) {
        startTime = Date.now();
    }

    gameTimer = setInterval(() => {
        timeElapsed = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(timeElapsed / 60);
        const seconds = timeElapsed % 60;
        timerDisplay.textContent = `Time: ${minutes}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

// Handle reset game button
document.getElementById('resetButton').addEventListener('click', () => {
    createBoard();
    clearHighlights();
    selectedPiece = null;
    currentPlayer = 'white';
    timeElapsed = 0;
    startTime = null;
    clearInterval(gameTimer);
    timerDisplay.textContent = 'Time: 0:00';
    isGameStarted = false;
    startTimer();
});

// Initialize the game
createBoard();
startTimer(); // Start the timer as soon as the game starts

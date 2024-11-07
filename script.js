const board = document.getElementById('board');
const timerDisplay = document.getElementById('playerTimer');
const turnDisplay = document.getElementById('turn');

let selectedPiece = null;
let currentPlayer = 'black';
let gameTimer = null;
let timeElapsed = 0;
let isGameStarted = false;

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

    board.innerHTML = ''; 

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell', (row + col) % 2 === 0 ? 'light' : 'dark');
            cell.dataset.row = row;
            cell.dataset.col = col;

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

            board.appendChild(cell);
        }
    }
}

// Handle piece movement and capturing
function handleClick(event) {
    const target = event.target;

    if (target.classList.contains('piece') && target.classList.contains(currentPlayer)) {
        if (selectedPiece) {
            selectedPiece.classList.remove('selected');
        }
        selectedPiece = target;
        selectedPiece.classList.add('selected');
        highlightValidMoves(target);
    } else if (selectedPiece && target.classList.contains('valid-move')) {
        movePiece(target);
        clearHighlights();
    }
}

// Highlight valid moves
function highlightValidMoves(piece) {
    const row = parseInt(piece.dataset.row);
    const col = parseInt(piece.dataset.col);
    const directions = currentPlayer === 'black' ? [[1, -1], [1, 1]] : [[-1, -1], [-1, 1]];
    clearHighlights();

    directions.forEach(dir => {
        const newRow = row + dir[0];
        const newCol = col + dir[1];
        const targetCell = getCell(newRow, newCol);

        if (targetCell && !targetCell.hasChildNodes()) {
            targetCell.classList.add('valid-move');
        } else if (targetCell && targetCell.firstChild && targetCell.firstChild.classList.contains(getOpponent())) {
            const jumpRow = newRow + dir[0];
            const jumpCol = newCol + dir[1];
            const jumpCell = getCell(jumpRow, jumpCol);

            if (jumpCell && !jumpCell.hasChildNodes()) {
                jumpCell.classList.add('valid-move');
                jumpCell.dataset.captureRow = newRow;
                jumpCell.dataset.captureCol = newCol;
            }
        }
    });
}

// Clear move highlights
function clearHighlights() {
    document.querySelectorAll('.valid-move').forEach(cell => cell.classList.remove('valid-move'));
}

// Get cell by row and column
function getCell(row, col) {
    return board.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
}

// Switch player
function switchPlayer() {
    currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
    turnDisplay.textContent = `Turn: ${capitalize(currentPlayer)}`;
}

// Move piece
function movePiece(targetCell) {
    const captureRow = targetCell.dataset.captureRow;
    const captureCol = targetCell.dataset.captureCol;

    if (captureRow && captureCol) {
        const capturedPiece = getCell(captureRow, captureCol).firstChild;
        capturedPiece.remove();
    }

    targetCell.appendChild(selectedPiece);
    selectedPiece.classList.remove('selected');
    selectedPiece.dataset.row = targetCell.dataset.row;
    selectedPiece.dataset.col = targetCell.dataset.col;

    if ((currentPlayer === 'black' && targetCell.dataset.row == 7) || 
        (currentPlayer === 'white' && targetCell.dataset.row == 0)) {
        selectedPiece.classList.add('king');
    }

    selectedPiece = null;
    switchPlayer();
}

// Get opponent color
function getOpponent() {
    return currentPlayer === 'black' ? 'white' : 'black';
}

// Capitalize text
function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

// Initialize game
createBoard();
board.addEventListener('click', handleClick);
document.getElementById('resetButton').addEventListener('click', createBoard);

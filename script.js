const board = document.getElementById('board');
const timerDisplay = document.getElementById('timer');
let selectedPiece = null;
let currentPlayer = 'black'; // Default starting player
let gameTimer = null;
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

    board.innerHTML = ''; // Clear the board

    // Add cells and pieces
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell', (row + col) % 2 === 0 ? 'light' : 'dark');
            cell.dataset.row = row;
            cell.dataset.col = col;

            if ((row + col) % 2 !== 0) {  // Only place pieces on dark squares
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
board.addEventListener('click', handleClick);

function handleClick(event) {
    const target = event.target;

    if (target.classList.contains('piece')) {
        if (selectedPiece) {
            selectedPiece.classList.remove('selected');
        }
        selectedPiece = target;
        selectedPiece.classList.add('selected');
        highlightValidMoves(target);
    } else if (selectedPiece && target.classList.contains('cell') && target.classList.contains('dark')) {
        if (!target.hasChildNodes()) {  // Move only to empty, dark cells
            movePiece(target);
        }
    } else {
        clearHighlights(); // Clear highlights if clicked elsewhere
    }
}

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

function clearHighlights() {
    document.querySelectorAll('.valid-move').forEach(cell => {
        cell.classList.remove('valid-move');
    });
}

function movePiece(targetCell) {
    targetCell.appendChild(selectedPiece);
    selectedPiece.classList.remove('selected');
    clearHighlights();

    if (!isGameStarted) startTimer();

    selectedPiece.dataset.row = targetCell.dataset.row;
    selectedPiece.dataset.col = targetCell.dataset.col;

    currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
}

function startTimer() {
    isGameStarted = true;
    gameTimer = setInterval(() => {
        timeElapsed++;
        timerDisplay.textContent = `Time: ${timeElapsed}s`;
    }, 1000);
}

document.getElementById('resetButton').addEventListener('click', resetGame);

function resetGame() {
    createBoard();
    currentPlayer = 'black';
    clearInterval(gameTimer);
    timeElapsed = 0;
    timerDisplay.textContent = `Time: ${timeElapsed}s`;
    isGameStarted = false;
}

// Initialize game on load
createBoard();

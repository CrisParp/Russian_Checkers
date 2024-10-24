const board = document.getElementById('board'); // Get the board element 

function createBoard() { // Function to create the board
    const pieces = [
        ['b', 'b', 'b', 'b'], // Black pieces
        ['b', 'b', 'b', 'b'],
        ['b', 'b', 'b', 'b'],
        [], // Empty row
        [], // Empty row
        ['w', 'w', 'w', 'w'], // White pieces
        ['w', 'w', 'w', 'w'],
        ['w', 'w', 'w', 'w']
    ];

    for (let row = 0; row < 8; row++) { // Loop through rows
        for (let col = 0; col < 8; col++) { // Loop through columns
            const cell = document.createElement('div'); // Create a new cell
            cell.classList.add('cell'); // Add the 'cell' class 
            
            // Check if the cell should be light or dark
            if ((row + col) % 2 === 0) {
                cell.classList.add('light'); // Light gray cell
            } else {
                cell.classList.add('dark');  // Dark gray cell
            }

            // Add pieces to the board
            if (pieces[row][col] === 'b') {
                const piece = document.createElement('div');
                piece.classList.add('piece', 'black'); // Black pieces
                cell.appendChild(piece);
            } else if (pieces[row][col] === 'w') {
                const piece = document.createElement('div');
                piece.classList.add('piece', 'white'); // White pieces
                cell.appendChild(piece);
            }

            board.appendChild(cell); // Correctly append the cell to the board
        }
    }
}

createBoard();  // Call the function

let selectedPiece = null;  // Variable to store the selected piece

function handleClick(event) {
    const target = event.target; // Get clicked element

    if (target.classList.contains('piece')) {
        selectedPiece = target;  // Store the selected piece
        target.classList.add('selected');  // Highlight the selected piece
    } else if (selectedPiece && target.classList.contains('cell')) {
        target.appendChild(selectedPiece);  // Move the selected piece
        selectedPiece.classList.remove('selected');  // Remove highlight 
        selectedPiece = null; // Deselect piece after moving
    }
}

// Add event listeners to all cells 
document.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('click', handleClick); // Attach click handler
});

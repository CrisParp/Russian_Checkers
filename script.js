const board = document.getElementById('board'); // Get the board element

function createBoard() { // Function to create the board  
    for (let row = 0; row < 8; row++) { // Loop through rows
        for (let col = 0; col < 8; col++) { // Loop through columns
            const cell = document.createElement('div'); // Create a new cell
            cell.classList.add('cell'); // Add the 'cell' class 
            
            // Check if the cell should be dark
            if ((row + col) % 2 === 1) { // Correct check for dark cells
                cell.classList.add('dark'); // Add 'dark' class if it's a dark square
            }
            board.appendChild(cell); // Correctly append the cell to the board
        }
    }
}

createBoard(); // Call the function

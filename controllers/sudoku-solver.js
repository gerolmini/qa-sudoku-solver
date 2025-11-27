class SudokuSolver {

  validate(puzzleString) {
    if (!puzzleString) {
      return { error: 'Required field missing' };
    }
    if (puzzleString.length !== 81) {
      return { error: 'Expected puzzle to be 81 characters long' };
    }
    if (/[^1-9.]/.test(puzzleString)) {
      return { error: 'Invalid characters in puzzle' };
    }
    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let grid = this.transform(puzzleString);
    row = row.toUpperCase().charCodeAt(0) - 65;
    column = parseInt(column) - 1;
    if (grid[row][column] == value) {
      return true;
    }
    for (let i = 0; i < 9; i++) {
      if (grid[row][i] == value) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    let grid = this.transform(puzzleString);
    row = row.toUpperCase().charCodeAt(0) - 65;
    column = parseInt(column) - 1;
    if (grid[row][column] == value) {
      return true;
    }
    for (let i = 0; i < 9; i++) {
      if (grid[i][column] == value) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let grid = this.transform(puzzleString);
    row = row.toUpperCase().charCodeAt(0) - 65;
    column = parseInt(column) - 1;
    if (grid[row][column] == value) {
      return true;
    }
    let startRow = Math.floor(row / 3) * 3;
    let startCol = Math.floor(column / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[startRow + i][startCol + j] == value) {
          return false;
        }
      }
    }
    return true;
  }

  solve(puzzleString) {
    let validation = this.validate(puzzleString);
    if (validation !== true) {
      return validation;
    }
    let grid = this.transform(puzzleString);

    // Check if initial board is valid
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] !== '.') {
          let num = grid[row][col];
          grid[row][col] = '.'; // Temporarily remove to check validity
          if (!this.isValid(grid, row, col, num)) {
            return { error: 'Puzzle cannot be solved' };
          }
          grid[row][col] = num; // Restore
        }
      }
    }

    let solved = this.solveSudoku(grid);
    if (!solved) {
      return { error: 'Puzzle cannot be solved' };
    }
    return { solution: this.transformBack(solved) };
  }

  transform(puzzleString) {
    let grid = [];
    for (let i = 0; i < 9; i++) {
      let row = [];
      for (let j = 0; j < 9; j++) {
        row.push(puzzleString[i * 9 + j]);
      }
      grid.push(row);
    }
    return grid;
  }

  transformBack(grid) {
    return grid.flat().join('');
  }

  solveSudoku(grid) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === '.') {
          for (let num = 1; num <= 9; num++) {
            if (this.isValid(grid, row, col, num.toString())) {
              grid[row][col] = num.toString();
              if (this.solveSudoku(grid)) {
                return grid;
              }
              grid[row][col] = '.';
            }
          }
          return false;
        }
      }
    }
    return grid;
  }

  isValid(grid, row, col, num) {
    for (let x = 0; x < 9; x++) {
      if (grid[row][x] === num || grid[x][col] === num) {
        return false;
      }
    }
    let startRow = Math.floor(row / 3) * 3;
    let startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[startRow + i][startCol + j] === num) {
          return false;
        }
      }
    }
    return true;
  }
}

module.exports = SudokuSolver;

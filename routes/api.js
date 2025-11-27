'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      let { puzzle, coordinate, value } = req.body;
      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }
      const validation = solver.validate(puzzle);
      if (validation !== true) {
        return res.json(validation);
      }
      const row = coordinate.split('')[0];
      const column = coordinate.split('')[1];
      if (
        coordinate.length !== 2 ||
        !/[a-i]/i.test(row) ||
        !/[1-9]/.test(column)
      ) {
        return res.json({ error: 'Invalid coordinate' });
      }
      if (!/^[1-9]$/.test(value)) {
        return res.json({ error: 'Invalid value' });
      }
      let index = (row.toUpperCase().charCodeAt(0) - 65) * 9 + (parseInt(column) - 1);
      if (puzzle[index] == value) {
        return res.json({ valid: true });
      }
      let validRow = solver.checkRowPlacement(puzzle, row, column, value);
      let validCol = solver.checkColPlacement(puzzle, row, column, value);
      let validReg = solver.checkRegionPlacement(puzzle, row, column, value);
      let conflicts = [];
      if (validRow && validCol && validReg) {
        return res.json({ valid: true });
      } else {
        if (!validRow) {
          conflicts.push('row');
        }
        if (!validCol) {
          conflicts.push('column');
        }
        if (!validReg) {
          conflicts.push('region');
        }
        return res.json({ valid: false, conflict: conflicts });
      }
    });

  app.route('/api/solve')
    .post((req, res) => {
      let puzzle = req.body.puzzle;
      if (!puzzle) {
        return res.json({ error: 'Required field missing' });
      }
      if (puzzle.length !== 81) {
        return res.json({ error: 'Expected puzzle to be 81 characters long' });
      }
      if (/[^1-9.]/.test(puzzle)) {
        return res.json({ error: 'Invalid characters in puzzle' });
      }
      let solvedString = solver.solve(puzzle);
      if (!solvedString) {
        return res.json({ error: 'Puzzle cannot be solved' });
      }
      if (solvedString.error) {
        return res.json(solvedString);
      }
      return res.json(solvedString);
    });
};

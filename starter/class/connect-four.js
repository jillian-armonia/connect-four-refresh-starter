const Screen = require("./screen");
const Cursor = require("./cursor");

class ConnectFour {

  constructor() {

    this.playerTurn = "O";

    this.grid = [[' ',' ',' ',' ',' ',' ',' '],
                 [' ',' ',' ',' ',' ',' ',' '],
                 [' ',' ',' ',' ',' ',' ',' '],
                 [' ',' ',' ',' ',' ',' ',' '],
                 [' ',' ',' ',' ',' ',' ',' '],
                 [' ',' ',' ',' ',' ',' ',' ']]

    this.cursor = new Cursor(6, 7);

    // Initialize a 6x7 connect-four grid
    Screen.initialize(6, 7);
    Screen.setGridlines(true);

    // Replace this with real commands
    Screen.addCommand('t', 'test command (remove)', ConnectFour.testCommand);

    this.cursor.setBackgroundColor();
    Screen.render();
  }

  // Remove this
  static testCommand() {
    console.log("TEST COMMAND");
  }

  static checkWin(grid) {
    //Create a helper function for consecutive numbers
    function checkConsecutive(array){
      for (let i = 0; i < array.length - 3; i++){
        let elem = array[i];

        if (elem + 1 === array[i + 1] && elem + 2 === array[i + 2] && elem + 3 === array[i + 3]){
          return true;
        }
      }

      return false;
    }
    //Check for horizontal wins
    //Loop through the grid
    for (let i = 0; i < grid.length; i++){
      let row = grid[i];

      for (let j = 0; j < row.length - 3; j++){
    //Check if there are 4 consecutive duplicates in a row
        if (row[j] !== ' '){
          if (row[j] === row[j + 1] && row[j] === row[j + 2] && row[j] === row[j + 3]){
            return row[j];
          }
        }
      }
    }

    //Create two container arrays for X and O that will hold their coordinates in the grid
    let arrayX = [];
    let arrayO = [];
    //Use a nested loop to get the row and column coordinates of each symbol
    for (let i = 0; i < grid.length; i++){
      let row = grid[i];

      for (let j = 0; j < row.length; j++){
        let elem = row[j];

        if (elem === "X" && arrayX.indexOf([i, j]) === -1){
          arrayX.push([i, j]);
        } else if (elem === "O" && arrayO.indexOf([i, j]) === -1){
          arrayO.push([i, j]);
        }
      }
    }

    //Iterate through each X and O array to check for each type of win using a nested loop to access both numbers in each nested array


    function checkVerticalAndDiagonal(array){
      array.sort();

      for (let i = 0; i < array.length - 3; i++){
        let elem1 = array[i];
        let elem2 = array[i + 1];
        let elem3 = array[i + 2];
        let elem4 = array[i + 3];
        //Vertical wins = consecutive row numbers, same column
        if (elem1[1] === elem2[1] && elem1[1] === elem3[1] && elem1[1] === elem4[1]){
          let sameColumn = [elem1[0], elem2[0], elem3[0], elem4[0]];

          if (checkConsecutive(sameColumn)){
            return true;
          }
        //Diagonal downward = ascending rows, ascending columns
        } else if (elem1[1] + 1 === elem2[1] && elem2[1] + 1 === elem3[1] && elem3[1] + 1 === elem4[1]){
          let ascendingColumn = [elem1[0], elem2[0], elem3[0], elem4[0]];

          if (checkConsecutive(ascendingColumn)){
            return true;
          }
        //Diagonal upward = descending rows, ascending columns
        } else if (elem1[0] + 1 === elem2[0] && elem2[0] + 1 === elem3[0] && elem3[0] + 1 === elem4[0]){
          let ascendingRow = [elem1[1], elem2[1], elem3[1], elem4[1]];

          for (let i = 0; i < ascendingRow.length - 3; i++){
            let number = ascendingRow[i];

            if (number - 1 === ascendingRow[i + 1] && number - 2 === ascendingRow[i + 2] && number - 3 === ascendingRow[i + 3]){
              return true;
            }
          }
        }
      }

      return false;
    }

    if (checkVerticalAndDiagonal(arrayO)){
      return "O";
    } else if (checkVerticalAndDiagonal(arrayX)){
      return "X";
    }

    // Return 'X' if player X wins
    // Return 'O' if player O wins
    // Return 'T' if the game is a tie
    function checkEmpty(array){
      return array.every(element => element !== ' ')
    }

    if (grid.every(array => checkEmpty(array))){
      return 'T';
    }

    // Return false if the game has not ended

    return false;
  }

  static endGame(winner) {
    if (winner === 'O' || winner === 'X') {
      Screen.setMessage(`Player ${winner} wins!`);
    } else if (winner === 'T') {
      Screen.setMessage(`Tie game!`);
    } else {
      Screen.setMessage(`Game Over`);
    }
    Screen.render();
    Screen.quit();
  }

}

module.exports = ConnectFour;

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
    Screen.addCommand('left', 'move left', this.cursor.left.bind(this.cursor));
    Screen.addCommand('right', 'move right', this.cursor.right.bind(this.cursor));
    Screen.addCommand('return', 'place a move', this.placeMove.bind(this));

    this.cursor.setBackgroundColor();
    Screen.render();
  }

  placeMove(){
    for (let i = this.grid.length - 1; i >= 0; i--){
      let row = this.grid[i];

      if (row[this.cursor.col] === ' ' && this.playerTurn === "O"){
        Screen.setGrid(i, this.cursor.col, this.playerTurn);
        row[this.cursor.col] = this.playerTurn;
        this.playerTurn = "X";
        this.cursor.cursorColor = "magenta";
        this.cursor.setBackgroundColor();

        if (ConnectFour.checkWin(this.grid) === false){
          Screen.render();
          return;
        } else {
          ConnectFour.endGame(ConnectFour.checkWin(this.grid));
        }

      } else if (row[this.cursor.col] === ' ' && this.playerTurn === "X"){
        Screen.setGrid(i, this.cursor.col, this.playerTurn);
        row[this.cursor.col] = this.playerTurn;
        this.playerTurn = "O";
        this.cursor.cursorColor = "yellow";
        this.cursor.setBackgroundColor();

        if (ConnectFour.checkWin(this.grid) === false){
          Screen.render();
          return;
        } else {
          ConnectFour.endGame(ConnectFour.checkWin(this.grid));
        }
      }
    }
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

    let sortedX = arrayX.sort();
    let sortedO = arrayO.sort();

    //Iterate through each X and O array to check for each type of win using a nested loop to access both numbers in each nested array
    const checkVertical = (array) => {

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
        }
      }

      return false;
    }

    const checkDiagonalDown = (array) => {

      for (let i = 0; i < array.length - 3; i++){
        let elem1 = array[i];
        let elem2 = array[i + 1];
        let elem3 = array[i + 2];
        let elem4 = array[i + 3];

        //Diagonal downward = ascending rows, ascending columns

        if (elem1[1] + 1 === elem2[1] && elem1[1] + 2 === elem3[1] && elem1[1] + 3 === elem4[1]){
          let ascendingColumn = [elem1[0], elem2[0], elem3[0], elem4[0]];

          if (checkConsecutive(ascendingColumn)){
            return true;
          }
        }

      }

      return false;
    }


    const checkDiagonalUp = (array) =>{

      for (let i = 0; i < array.length - 3; i++){
        let elem1 = array[i];
        let elem2 = array[i + 1];
        let elem3 = array[i + 2];
        let elem4 = array[i + 3];
        //Diagonal upward = descending rows, ascending columns

        if (elem1[0] + 1 === elem2[0] && elem1[0] + 2 === elem3[0] && elem1[0] + 3 === elem4[0]){
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

    if (checkVertical(sortedO)){
      return "O";
    } else if (checkVertical(sortedX)){
      return "X";
    }

    if (checkDiagonalDown(sortedO)){
      return "O";
    } else if (checkDiagonalDown(sortedX)){
      return "X";
    }

    if (checkDiagonalUp(sortedO)){
      return "O";
    } else if (checkDiagonalUp(sortedX)){
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

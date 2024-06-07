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
    for (let i = this.grid.length - 1; i >= 0; i--){ //Check the moves from the bottom of the grid
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
    function checkConsecutive(array, nestedIndex){
      for (let i = 0; i < array.length - 3; i++){
        let elem = array[i];

        if (elem[nestedIndex] + 1 === array[i + 1][nestedIndex] && elem[nestedIndex] + 2 === array[i + 2][nestedIndex] && elem[nestedIndex] + 3 === array[i + 3][nestedIndex]){
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

    //vertical wins: consecutive rows, same columns
    function checkVertical(array){
      for (let i = 0; i < array.length - 3; i++){
        let column = array[i][1];
        let sameColumn = [];
        for (const element of array){
          if (element[1] === column){ //Find the elements with the same column value
            sameColumn.push(element);
          }
        }

        if (checkConsecutive(sameColumn, 0)){
          return true;
        }
      }

      return false;
    }

    //diagonal downwards wins: increasing row indexes, increasing column indexes
    function checkDiagonalDown(array){
      let potential = [];

      if (array.length === 1){
        return array;
      }

      function findFirstPotential(){

        for (let currentEl of array){
          for (let nextEl of array){ //compares a current element to the same array by iteration
            if (currentEl[0] + 1 === nextEl[0] && currentEl[1] + 1 === nextEl[1]){
              return nextEl;
            }
          }
        }
      }

      if (findFirstPotential() === undefined){
        return false;
      }

      potential.push(findFirstPotential())

      for (let next of array){
        if (potential[potential.length - 1][0] + 1 === next[0] && potential[potential.length - 1][1] + 1 === next[1]){
          potential.push(next)
        }
      }

      if (potential.length < 3){
        let newArray = array.filter((element) => {
          if(!potential.includes(element)){
            return true;
          }
        })

        potential = [];
        return checkDiagonalDown(newArray);
      } else if (potential.length >= 3){
        return true;
      }

      return false;
    }

   //diagonal upward wins: increasing row indexes, decreasing column indexes
   function checkDiagonalUp(array){
    let potential = [];

    if (array.length === 1){
      return array;
    }

    function findFirstPotential(){

      for (let currentEl of array){
        for (let nextEl of array){ //compares a current element to the same array by iteration
          if (currentEl[0] + 1 === nextEl[0] && currentEl[1] - 1 === nextEl[1]){
            return nextEl;
          }
        }
      }
    }

    if (findFirstPotential() === undefined){
      return false;
    }

    potential.push(findFirstPotential())

    for (let next of array){
      if (potential[potential.length - 1][0] + 1 === next[0] && potential[potential.length - 1][1] - 1 === next[1]){
        potential.push(next)
      }
    }

    if (potential.length < 3){
      let newArray = array.filter((element) => {
        if(!potential.includes(element)){
          return true;
        }
      })

      potential = [];
      return checkDiagonalUp(newArray);
    } else if (potential.length >= 3){

      return true;
    }

    return false;
  }

    if (checkVertical(sortedX) || checkDiagonalDown(sortedX) === true|| checkDiagonalUp(sortedX) === true) {
      return 'X';
    } else if (checkVertical(sortedO) || checkDiagonalDown(sortedO) === true || checkDiagonalUp(sortedO) === true){
      return 'O';
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

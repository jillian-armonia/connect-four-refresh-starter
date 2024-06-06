let grid =      [['X',' ',' ',' ','X','X',' '],
                 [' ',' ',' ',' ',' ','X',' '],
                 [' ',' ',' ','X',' ',' ','X'],
                 [' ',' ',' ','X',' ',' ',' '],
                 [' ','X',' ',' ',' ',' ',''],
                 ['X',' ',' ',' ',' ','X',' ']]

function checkConsecutive(array, nestedIndex){
      for (let i = 0; i < array.length - 3; i++){
        let elem = array[i];

        if (elem[nestedIndex] + 1 === array[i + 1][nestedIndex] && elem[nestedIndex] + 2 === array[i + 2][nestedIndex] && elem[nestedIndex] + 3 === array[i + 3][nestedIndex]){
          return true;
        }
      }

      return false;
    }

    let arrayX = [];
     let arrayO = [];
     //Use a nested loop to get the row and column nestedIndexs of each symbol
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

function checkDiagonalUp(array){
  let potential = [];

  if (array.length === 1){
    return array;
  }

  function findFirstPotential(){
    let firstEl;

    for (let currentEl of array){
      for (let nextEl of array){ //compares a current element to the same array by iteration
        if (currentEl[0] + 1 === nextEl[0] && currentEl[1] - 1 === nextEl[1]){
          return firstEl = nextEl;
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

console.log(checkDiagonalUp(sortedX))

//I want to use the last element of the potential array to check on the original array!
//1. Find the first element of the potential array by finding if it has a consecutive row,col with it
//2. Use the potential array as a reference to find the next 2 pairs
//3. If it doesn't find it, then it moves back to the next element of the original array and does the same thing with no. 1
//4. If the potential array length gets to 3, then you have a diagonal down win!

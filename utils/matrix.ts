// Custom utils
import { getDistance } from "./helpers";


export default function Matrix() {

  function findNeighbors(matrix: boolean[][], row: number, col: number): (boolean | undefined)[][] {
    const cell = matrix[row][col];

    let top = undefined,
      top_left = undefined,
      top_right = undefined,
      left = undefined,
      right = undefined,
      bottom = undefined,
      bottom_left = undefined,
      bottom_right = undefined;

    if (row > 0) {
      top = matrix[row - 1][col];

      if (col > 0) {
        top_left = matrix[row - 1][col - 1];
      }

      if (col < matrix[1].length - 1) {
        top_right = matrix[row - 1][col + 1];
      }
    }

    if (col > 0) {
      left = matrix[row][col - 1];
    }

    if (col < matrix[1].length - 1) {
      right = matrix[row][col + 1];
    }

    if (row < matrix[0].length - 1) {
      bottom = matrix[row + 1][col];

      if (col > 0) {
        bottom_left = matrix[row + 1][col - 1];
      }

      if (col < matrix[1].length - 1) {
        bottom_right = matrix[row + 1][col + 1];
      }
    }

    return [
      [top_left, top, top_right],
      [left, cell, right],
      [bottom_left, bottom, bottom_right]
    ];
  }

  function updateCellBasedOnNeighbors(cellAndEightNeighbors: (boolean | undefined)[][]): boolean {

    const cell = cellAndEightNeighbors[1][1] as boolean;

    let livingNeighbors = 0;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (cellAndEightNeighbors[i][j]) {
          if (i !== 1 || j !== 1) {
            livingNeighbors += 1;
          }
        }
      }
    }

    if (!cell) {
      if (livingNeighbors >= 2 && livingNeighbors <= 3) {
        return true;
      } else {
        return false;
      }
      
    } else {
      if (livingNeighbors >= 5) {
        return true;
      } else {
        return false;
      }
    }
  }

  function updateMatrix(state: boolean[][]): boolean[][] {

    let rows = state[0].length,
      cols = state[1].length

    let result = [...Array(rows)].map(el => Array(cols));
    
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        let cellAndEightNeighbors = findNeighbors(state, i, j);

        let newCellValue = updateCellBasedOnNeighbors(cellAndEightNeighbors);
        result[i][j] = newCellValue;
      }
    }

    return result;
  }

  function movePlayer(
    state: boolean[][],
    position: number[],
    direction: 'U' | 'D' | 'L' | 'R'
  ): number[] | null {

    let cellAndEightNeighbors = findNeighbors(state, position[0], position[1]);

    if (direction === 'U' && cellAndEightNeighbors[0][1] !== undefined) {
      return [position[0] - 1, position[1]]

    } else if (direction === 'D' && cellAndEightNeighbors[2][1] !== undefined) {
      return [position[0] + 1, position[1]]

    } else if (direction === 'L' && cellAndEightNeighbors[1][0] !== undefined) {
      return [position[0], position[1] - 1]

    } else if (direction === 'R' && cellAndEightNeighbors[1][2] !== undefined) {
      return [position[0], position[1] + 1]

    } else {
      return null;
    }
  }
 
  function checkIfBreakingPoint(
    breakingPoints: string[],
    possibleMovements: string[],
    position: number[],
    turn: number,
    move: string
  ): string[] {

    if (!breakingPoints.includes(`${String(position)}-${String(turn+1)}`)) {
      possibleMovements.push(move)
    }

    return possibleMovements;
  }

  function decideWhereToMove(
    playerPosition: number[],
    breakingPoints: string[],
    state: boolean[][],
    position: number[],
    turn: number,
    stepsAhead: number
  ): string | null {

    if (stepsAhead === 0) {
      return '';
    }

    let possibleMovements: string[] = [];

    let top = [position[0] - 1, position[1]];
    let bottom = [position[0] + 1, position[1]];
    let left = [position[0], position[1] - 1];
    let right = [position[0], position[1] + 1];

    let topDistance = getDistance(playerPosition, top);
    let bottomDistance = getDistance(playerPosition, bottom);
    let leftDistance = getDistance(playerPosition, left);
    let rightDistance = getDistance(playerPosition, right);

    let positionsDistancesMoves = [
      {position: top, distance: topDistance, move: 'U'},
      {position: bottom, distance: bottomDistance, move: 'D'},
      {position: left, distance: leftDistance, move: 'L'},
      {position: right, distance: rightDistance, move: 'R'}
    ];

    let nextState = updateMatrix(state);

    for (let candidate of positionsDistancesMoves.sort((a, b) => a.distance - b.distance)) {

      if (candidate) {
        if (candidate.position[0] >= 0 && candidate.position[0] <= state[0].length - 1 && candidate.position[1] >= 0 && candidate.position[1] <= state[1].length - 1) {
          
          if (nextState[candidate.position[0]][candidate.position[1]] === false) {
            possibleMovements = checkIfBreakingPoint(
              breakingPoints, possibleMovements, candidate.position, turn, candidate.move
            );
          }
        }
      }
    }

    while (possibleMovements.length > 0) {

      let index: number;

      for (let candidate of positionsDistancesMoves) {
        if (possibleMovements.includes(candidate.move)) {
          if (decideWhereToMove(
            playerPosition,
            breakingPoints,
            nextState,
            candidate.position,
            turn + 1,
            stepsAhead - 1
          ) === null) {
            index = possibleMovements.indexOf(candidate.move);
            possibleMovements.splice(index, 1);
          } else {
            return candidate.move
          }
        }
      }
    }

    if (!breakingPoints.includes(`${String(position)}-${String(turn+1)}`)) {
      breakingPoints.push(`${String(position)}-${String(turn+1)}`, `${String(position)}-${String(turn+1)}`)
    }

    return null;

  }

  function moveFoe(
    foePosition: number[],
    breakingPoints: string[],
    state: boolean[][],
    position: number[],
    turn: number
  ): {
    nextPosition: number[], 
    breakingPoints: string[]
  } {
    let currentMove = decideWhereToMove(
      foePosition,
      breakingPoints,
      state,
      position,
      turn,
      5
    );

    if (currentMove === null) {
      if (!breakingPoints.includes(`${String(position)}-${String(turn+1)}`)) {
        breakingPoints.push(`${String(position)}-${String(turn+1)}`)
      };

    } else {

      if (currentMove === 'U') {
        return {
          nextPosition: [position[0] - 1, position[1]],
          breakingPoints
        }

      } else if (currentMove === 'D') {
        return {
          nextPosition: [position[0] + 1, position[1]],
          breakingPoints
        }

      } else if (currentMove === 'L') {
        return {
          nextPosition: [position[0], position[1] - 1],
          breakingPoints
        }

      } else if (currentMove === 'R') {
        return {
          nextPosition: [position[0], position[1] + 1],
          breakingPoints
        }
      }
    }

    return {nextPosition: foePosition, breakingPoints};
  }

  return {
    findNeighbors,
    updateCellBasedOnNeighbors,
    updateMatrix,
    movePlayer,
    moveFoe
  }
}
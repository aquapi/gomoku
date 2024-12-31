/**
 * Check whether a row has 5 consecutive pieces
 * @params sets - The row bitset list
 * @params rowPos - The row bitset index
 * @param posIndex - The position in the row bitset to start checking from
 */
export const finished = (sets: Uint16Array, rowPos: number, posIndex: number): boolean => {
  // Play the move
  let rowSet = sets[rowPos] |= 1 << posIndex;

  // Keep 9 digits around the position to check
  rowSet = (rowSet >>> Math.max(posIndex - 4, 0)) & 511;

  while (rowSet > 31) {
    // Whether 5 consecutive bits are set
    if (rowSet >>> 31 === 31)
      return true;

    // Push 1 bit out
    rowSet >>>= 1;
  }

  return false;
}

const l16 = { length: 16 } as const, l31 = { length: 31 } as const;

export type Sets = [
  row: Uint16Array,
  col: Uint16Array,
  firstDiag: Uint16Array,
  secondDiag: Uint16Array
];

/**
 * Create bitsets for a piece
 */
export const createSets = (): Sets => [
  new Uint16Array(l16), new Uint16Array(l16),
  // Diagonals take more spaces
  new Uint16Array(l31), new Uint16Array(l31),
];

/**
 * Register the move on every sets and check if the current player wins
 * @param sets
 * @param x
 * @param y
 * @returns
*/
export const mark = (sets: Sets, x: number, y: number): boolean =>
  // Row
  finished(sets[0], y, x) ||
  // Col
  finished(sets[1], x, y) ||
  // First diag
  finished(sets[2], x - y + 15, Math.max(x, y)) ||
  // Second diag
  finished(sets[3], x + y, Math.min(x, 15 - y));

export type Board = [
  xSets: Sets,
  ySets: Sets,
  count: number,
  finished: boolean
];

export const boards = new Map<string, Board>();

/**
 * Create data for a room
 */
export const createBoard = (name: string) => {
  let board: Board = [createSets(), createSets(), 0, false];
  boards.set(name, board);
  return board;
};

export const clearBoard = (board: Board) => {
  board[0] = createSets();
  board[1] = createSets();
  board[2] = 0;
  board[3] = false;
}

/**
  x ->
 y
 |
*/

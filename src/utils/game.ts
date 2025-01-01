export type Board = [
  // bitset size 256
  xSet: bigint | null,
  // bitset size 256
  oSet: bigint | null,
  // < 0 means not in game
  // other than that is the move counter
  inGame: number,
  // Invert turn when necessary
  startTurn: number,
];

export const boards = new Map<string, Board>();

/**
 * Create data for a room
 */
export const createBoard = (name: string) => {
  let board: Board = [null, null, -1, 0];
  boards.set(name, board);
  return board;
};

// Reset the board
export const resetBoard = (board: Board) => {
  board[0] = board[1] = null;
  board[2] = -1;

  // Swap the turn
  board[3] = 1 - board[3];
}

// In game
export const startBoard = (board: Board) => {
  // Initialize enough spaces
  board[0] = board[1] = 0n;
  board[2] = 0;
  return board;
}

export const inGame = (board: Board) => board[2] > -1;

// Validate player turn (also check in game status)
export const invalidTurn = (board: Board, playerTurn: number): boolean =>
  board[2] < 0 || playerTurn !== ((board[2] + board[3]) & 1);

// Validate move
export const invalidMove = (board: Board, pos: bigint) =>
  (((board[0]! | board[1]!) >> pos) & 1n) === 1n;

// Check win
export const detectWinDirection = (mask: bigint, direction: bigint): boolean => {
  mask &= mask >> direction; // Check two consecutive bits
  mask &= mask >> direction; // Check three in a row
  mask &= mask >> direction; // Check four in a row
  mask &= mask >> direction; // Check five in a row
  return mask !== 0n; // Found five in a row
}

export const detectWin = (board: Board, playerTurn: 0 | 1, pos: bigint): boolean => {
  let set = board[playerTurn]! |= 1n << pos;

  return detectWinDirection(set, 1n) || // X
    detectWinDirection(set, 16n) || // Y
    detectWinDirection(set, 17n) || // First diag
    detectWinDirection(set, 15n); // Second diag
}

import type { Board } from "./game";

export const startAsX = new Uint8Array([0, 0]),
  startAsO = new Uint8Array([0, 1]),
  startAsSpectator = new Uint8Array([0, 2]);

export const createMove = (pos: number, turn: number) =>
  new Uint8Array([1, pos, turn]);

// Corresponding wins
export const winMessages = [new Uint8Array([2, 0]), new Uint8Array([2, 1])],
  draw = new Uint8Array([2, 2]);

// Sync board
export const syncBoard = (board: Board) => {
  const msg = new Uint8Array(65);
  msg[0] = 3;

  // 32 slots each for X and O
  for (let i = 1, xSets = board[0]!, ySets = board[1]!; i < 33; i++) {
    msg[i] = Number(xSets & 0xffn);
    xSets >>= 8n;

    msg[i + 32] = Number(ySets & 0xffn);
    ySets >>= 8n;
  }

  return msg;
}

export const startAsX = new Uint8Array([0, 0]),
  startAsO = new Uint8Array([0, 1]),
  startAsSpectator = new Uint8Array([0, 2]);

export const createMove = (pos: number, turn: number) =>
  new Uint8Array([1, pos, turn]);

// Corresponding wins
export const winMessages = [new Uint8Array([2, 0]), new Uint8Array([2, 1])],
  draw = new Uint8Array([2, 2]);

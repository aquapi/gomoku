let pieces = [document.createElement("div"), document.createElement("div")];
pieces[0].className = "piece-0";
pieces[1].className = "piece-1";

let socket = new WebSocket("/ws/room" + location.search),
  /** @type {0 | 1 | 2 | undefined} */
  turn;

/** @type {HTMLElement} */
let main = document.querySelector("main");
/** @type {HTMLHeadingElement} */
let dialog = document.getElementById("dialog");

/**
 * @type {(this: HTMLSpanElement, ev: MouseEvent) => any}
 */
let boardSquareClick = function () {
  socket.send(new Uint8Array([0, +this.dataset.id]));
};
let board = Array.from({ length: 256 }, (_, i) => {
  let el = document.createElement("span");

  el.className = "ui-effect";
  el.dataset.id = i;
  el.addEventListener("click", boardSquareClick);

  main.appendChild(el);
  return el;
});

socket.binaryType = "arraybuffer";

socket.addEventListener("error", (e) => {
  console.log(e.message, socket.readyState);
});
socket.addEventListener("message", (e) => {
  /** @type {Uint8Array} */
  let msg = new Uint8Array(e.data);

  switch (msg[0]) {
    // [0, turn]
    case 0:
      turn = msg[1];
      dialog.textContent =
        turn === 2
          ? "Spectating..."
          : (turn === 0 ? "Your" : "Opponent") + " turn";

      // Clear board
      for (let i = 0; i < 256; i++) board[i].innerHTML = "";
      break;

    // [1, pos, turn]
    case 1:
      board[msg[1]].appendChild(pieces[msg[2]].cloneNode());
      dialog.textContent = (msg[2] === turn ? "Opponent" : "Your") + " turn!";
      break;

    // [2, 0 | 1 | 2]
    case 2:
      dialog.textContent =
        msg[1] === 2
          ? "Game drawn!"
          : msg[1] === turn
            ? "You win!"
            : "You lose!";

      break;
  }
});

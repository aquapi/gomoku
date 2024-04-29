import Board from './board';

const color = ['Red', 'Blue'];

function play(this: HTMLElement) {
    if (this.innerHTML.length !== 0) return;

    const { turn } = board;
    if (board.set(+this.id)) {
        // @ts-ignore
        ++board.counters.item(turn).innerText;
        board.reset(1 - turn);

        alert(`${color[turn]} wins! ${color[1 - turn]} goes first!`);
    }
};

// Prepare board listeners
const board = new Board(document.body, 0);
const { elements } = board;

for (let i = 0; i < 256; ++i)
    elements[i].addEventListener('click', play);


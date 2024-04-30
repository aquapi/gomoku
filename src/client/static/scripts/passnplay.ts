import Board from './board';

const color = ['Red', 'Blue'];
function play(this: HTMLElement) {
    if (this.innerHTML.length !== 0) return;

    const { turn } = board;
    const nextTurn = 1 - turn;

    // @ts-ignore
    switch (board.set(+this.dataset.id)) {
        case 0: return;
        case 1:
            // @ts-ignore
            ++board.counters.item(turn).innerText;
            alert(`${color[turn]} wins! ${color[nextTurn]} goes first!`);
            break;
        case 2:
            alert(`It's a draw! ${color[nextTurn]} goes first!`);
            break;
    }

    board.clear();
};

// Prepare board listeners
const board = new Board(document.body);
const { elements } = board;

for (let i = 0; i < 256; ++i)
    elements[i].addEventListener('click', play);


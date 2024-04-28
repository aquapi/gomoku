import Board from './board.js';

const redCircle = document.createElement('div');
redCircle.className = 'circle red';

const blueCircle = document.createElement('div');
blueCircle.className = 'circle blue';

const board = new Board();
const counters = [document.getElementById('red-counter'), document.getElementById('blue-counter')];

/**
 * @this HTMLElement
 */
function play() {
    if (this.innerHTML.length === 0) {
        const { turn } = board;

        this.appendChild((turn === 0 ? redCircle : blueCircle).cloneNode());
        const id = +this.id;

        if (board.set(id)) {
            board.reset(1 - turn);
            ++counters[turn].innerText;

            return alert(`${turn === 0 ? 'Red' : 'Blue'} wins! ${turn === 0 ? 'Blue' : 'Red'} goes first!`);
        }
    }
}

// Initialization
const { elements } = board;
for (let i = 0; i < 256; ++i) elements[i].addEventListener('click', play);

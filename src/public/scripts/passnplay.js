import Board from './board.js';

const redCircle = document.createElement('div');
redCircle.className = 'circle bg-red';

const blueCircle = document.createElement('div');
blueCircle.className = 'circle bg-blue';

const board = new Board();

const counter = document.getElementById('counter');

const borders = ['border-red', 'border-blue'];
const colorMap = ['Red', 'Blue'];
const counters = [document.getElementById('red-counter'), document.getElementById('blue-counter')];

/**
 * @this HTMLElement
 */
function play() {
    if (this.innerHTML.length === 0) {
        const { turn } = board;
        const nextTurn = 1 - turn;

        this.appendChild((turn === 0 ? redCircle : blueCircle).cloneNode());
        const id = +this.id;

        if (board.set(id)) {
            board.reset(nextTurn);
            ++counters[turn].innerText;

            alert(`${colorMap[turn]} wins! ${colorMap[nextTurn]} goes first!`);
        }

        counter.className = borders[nextTurn];
    }
}

// Initialization
const { elements } = board;
for (let i = 0; i < 256; ++i) elements[i].addEventListener('click', play);

counter.className = borders[board.turn];

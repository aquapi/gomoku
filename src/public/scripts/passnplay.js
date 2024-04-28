import Board from './board.js';

const redCircle = document.createElement('div');
redCircle.className = 'circle red';

const blueCircle = document.createElement('div');
blueCircle.className = 'circle blue';

const board = new Board();

/**
 * @this HTMLElement
 */
function play() {
    if (this.innerHTML.length === 0) {
        this.appendChild((board.turn === 0 ? redCircle : blueCircle).cloneNode());

        const id = +this.id;
        if (board.set(id)) {
            alert(`${board.turn === 0 ? 'Blue' : 'Red'} wins!`);
            location.reload();
        }
    }
}

const { elements } = board;
for (let i = 0; i < 256; ++i) elements[i].addEventListener('click', play);

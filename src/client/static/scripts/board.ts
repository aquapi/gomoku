import Board from '@lib/board';

export default class ClientBoard extends Board {
    // Store board squares 
    elements: HTMLElement[];

    // Store the counter element
    counter: HTMLElement;

    // Store red and blue counters
    counters: NodeListOf<HTMLElement>;

    constructor(game: HTMLElement) {
        super();

        const board = game.querySelector('.board')!;
        const stat = game.querySelector('.status')!;

        // Init board
        const elements = this.elements = new Array(256);
        for (let i = 0; i < 256; ++i) {
            const el = document.createElement('div');
            el.className = 'sq';
            el.dataset.id = `${i}`;

            elements[i] = el;
            board.appendChild(el);
        }

        // Init status
        const counter = this.counter = stat.querySelector('.counter')!;
        counter.classList.add(borders[0]);
        this.counters = counter.querySelectorAll('div');
    }

    // Clear the board
    clear() {
        const { elements } = this;
        for (let i = 0; i < 256; ++i)
            elements[i].innerHTML = '';

        super.reset();
    }

    // Play the move and change the turn
    set(pos: number) {
        const { turn } = this;

        // Change the border of the counter
        const { classList } = this.counter;
        classList.remove(borders[turn]);
        classList.add(borders[1 - turn]);

        // Append a circle node to the square
        this.elements[pos].appendChild(circles[turn].cloneNode());

        return super.set(pos);
    }
}

// Circle template
const circles = [
    document.createElement('div'),
    document.createElement('div')
];

circles[0].className = 'circle bg-red';
circles[1].className = 'circle bg-blue';

// Borders map
const borders = ['border-red', 'border-blue']; 

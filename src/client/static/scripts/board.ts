export default class Board {
    // Store board squares 
    elements: HTMLElement[];

    // Store the circles id
    sqTurn: number[];

    // Store the status element
    status: HTMLElement;

    // Store the counter element
    counter: HTMLElement;

    // Store red and blue counters
    counters: NodeListOf<HTMLElement>;

    // Store the current turn
    turn: number;

    // Count the filled square
    private filled: number;

    constructor(game: HTMLElement, firstTurn: number) {
        const board = game.querySelector('.board')!;
        const stat = this.status = game.querySelector('.status')!;

        // Init board
        const elements = this.elements = new Array(256);
        const sqTurn = this.sqTurn = new Array(256);

        for (let i = 0; i < 16; ++i)
            for (let j = 0; j < 16; ++j) {
                const idx = i << 4 | j;

                const el = document.createElement('div');
                el.className = "sq";
                el.id = `${idx}`;

                elements[idx] = el;
                sqTurn[idx] = -1;

                board.appendChild(el);
            }

        // Init status
        const counter = this.counter = stat.querySelector('.counter')!;
        counter.classList.add(borders[firstTurn]);

        this.counters = counter.querySelectorAll('div');

        this.turn = firstTurn;
        this.filled = 0;
    }

    // Reset the board with new turn
    reset(turn: number) {
        const { elements, sqTurn } = this;

        for (let i = 0; i < 16; ++i)
            for (let j = 0; j < 16; ++j) {
                const idx = i << 4 | j;
                elements[idx].innerHTML = '';
                sqTurn[idx] = -1;
            }

        this.changeTurn(turn);
        this.filled = 0;
    }

    // Count squares with the same pattern
    private count(pos: number, move: number) {
        const { sqTurn, turn } = this;

        const moveX = move >> 4;
        const moveY = move - (moveX << 4);

        let limit = Math.min(
            moveY < 0 ? pos & 15 : moveY > 0 ? 15 - (pos & 15) : 5,
            moveX < 0 ? pos >>> 4 : moveX > 0 ? 15 - (pos >>> 4) : 5,
            5
        );

        let cnt = 0;
        while (limit !== 0) {
            if (sqTurn[pos += move] !== turn)
                return cnt;

            ++cnt;
            --limit;
        }

        return cnt;
    }

    // Check if current turn is winning
    private check(pos: number) {
        for (let i = 0, { length } = directions; i < length; ++i)
            if (this.count(pos, directions[i]) + this.count(pos, -directions[i]) > 3)
                return true; return false;
    }

    // Play the move and change the turn
    set(pos: number) {
        const { turn } = this;
        ++this.filled;

        this.sqTurn[pos] = turn;
        this.elements[pos].appendChild(circles[turn].cloneNode());

        const hasWon = this.check(pos);

        this.changeTurn(1 - turn);
        return hasWon;
    }

    private changeTurn(nextTurn: number) {
        const { classList } = this.counter;
        classList.remove(borders[1 - nextTurn]);
        classList.add(borders[this.turn = nextTurn]);
    }

    full() {
        return this.filled === 256;
    }
}

const directions = [1, 15, 16, 17];

// Circle template
const circles = [
    document.createElement('div'),
    document.createElement('div')
];

circles[0].className = 'circle bg-red';
circles[1].className = 'circle bg-blue';

// Borders map
const borders = ['border-red', 'border-blue']; 

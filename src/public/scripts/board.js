// @ts-check
export default class Board {
    /**
     * @type HTMLElement[]
     */
    elements;

    /**
     * @type number[]
     */
    sqTurn;

    /**
     * @type number
     */
    turn;

    constructor() {
        const root = document.getElementById('board');
        if (root === null) throw new Error('Cannot find a board to initialize');

        const elements = new Array(256);
        const sqTurn = new Array(256);

        for (let i = 0; i < 16; ++i) {
            for (let j = 0; j < 16; ++j) {
                const idx = (i << 4) | j;
                const el = document.createElement('div');

                el.className = 'sq';
                el.id = `${idx}`;

                elements[idx] = el;
                sqTurn[idx] = -1;

                root.appendChild(el);
            }
        }

        this.elements = elements;
        this.sqTurn = sqTurn;
        this.turn = 0;
    }

    /**
     * @param {number} turn
     */
    reset(turn) {
        const { elements, sqTurn } = this;

        for (let i = 0; i < 16; ++i) {
            for (let j = 0; j < 16; ++j) {
                const idx = (i << 4) | j;

                elements[idx].innerHTML = '';
                sqTurn[idx] = -1;
            }
        }

        this.turn = turn;
    }

    /**
     * @param {number} pos
     * @param {number} move
     */
    count(pos, move) {
        const { sqTurn, turn } = this;

        const moveX = move >> 4;
        const moveY = move - (moveX << 4);

        let maxIterations = Math.min(
            moveY < 0 ? (pos & 15) : moveY > 0 ? 15 - (pos & 15) : 5,
            moveX < 0 ? (pos >>> 4) : moveX > 0 ? 15 - (pos >>> 4) : 5,
            5
        );
        let cnt = 0;

        while (maxIterations !== 0) {
            pos += move;
            if (sqTurn[pos] !== turn) return cnt;

            ++cnt;
            --maxIterations;
        }

        return cnt;
    }

    /**
     * @param {number} pos
     */
    check(pos) {
        for (let i = 0, { length } = directions; i < length; ++i)
            // >= 4 and does not count the current pos
            if (this.count(pos, directions[i]) + this.count(pos, -directions[i]) > 3)
                return true;

        return false;
    }

    /**
     * @param {number} id
     */
    set(id) {
        const { turn } = this;
        this.sqTurn[id] = turn;

        const hasWon = this.check(id);
        this.turn = 1 - turn;

        return hasWon;
    }
}

const directions = [1, 15, 16, 17];

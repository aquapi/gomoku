export default class Board {
    // @ts-ignore Store the circles id
    private sqTurn: number[];

    // Store the current turn
    readonly turn: number = 0;

    // @ts-ignore Count the filled square 
    private filled: number;

    // Create a board
    constructor() {
        this.reset();
    }

    // Play the move
    set(pos: number) {
        const { turn } = this;

        ++this.filled;
        this.sqTurn[pos] = turn;

        const hasWon = this.check(pos);

        // @ts-ignore
        this.turn = 1 - turn;
        return hasWon;
    }

    // Reset the board
    protected reset() {
        this.sqTurn = [
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1
        ];

        this.filled = 0;
    }

    // Count squares with the same pattern
    private count(pos: number, move: number) {
        const { sqTurn, turn } = this;

        // Cannot do bit shifting for negative numbers
        const moveX = move / 16;
        const moveY = move - (moveX * 16);

        const limit = Math.min(
            moveY < 0 ? pos & 15 : moveY === 0 ? 5 : 15 - (pos & 15),
            moveX < 0 ? pos >>> 4 : moveX === 0 ? 5 : 15 - (pos >>> 4),
            5
        );

        for (let cnt = 0; cnt < limit; ++cnt)
            if (sqTurn[pos += move] !== turn)
                return cnt;

        return limit;
    }

    // Return 1 if current turn is the winner
    check(pos: number): 0 | 1 | 2 {
        // Draw
        return this.filled === 256 ? 2
            // Check if current turn is winning
            : this.count(pos, 1) + this.count(pos, -1) > 3
                || this.count(pos, 15) + this.count(pos, -15) > 3
                || this.count(pos, 16) + this.count(pos, -16) > 3
                || this.count(pos, 17) + this.count(pos, -17) > 3 ? 1 : 0;
    }
}

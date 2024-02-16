class Box {
    constructor(x, y, size, color, premove) {
        Object.assign(this, { x, y, size, color, premove });
    }

    updateCoord(x, y) {
        this.x = x;
        this.y = y;
    }

    draw(ctx) {
        if (this.premove) {
            stroke(ctx, "red");
            strokeWeight(ctx, 10);
            rect(ctx, this.x, this.y, this.size, this.size);
        } else {
            stroke(ctx, "black");
            strokeWeight(ctx, 1);
            rect(ctx, this.x, this.y, this.size, this.size, this.color);
        }
    }
}

class Grid {
    constructor(game, gridSize) {
        this.game = game;
        this.gridSize = gridSize;
    }

    draw(ctx) {
        stroke(ctx, "black");
        strokeWeight(ctx, 1);
        for (let i = 1; i <= this.gridSize; i++) {
            line(ctx, PARAMS.HEIGHT * i / this.gridSize, 0, PARAMS.HEIGHT * i / this.gridSize, PARAMS.HEIGHT);
            line(ctx, 0, PARAMS.HEIGHT * i / this.gridSize, PARAMS.HEIGHT, PARAMS.HEIGHT * i / this.gridSize);
        }
    }
}
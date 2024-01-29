class Box {
    constructor(x, y, size, color, premove) {
        Object.assign(this, { x, y, size, color, premove });
    }

    updateCoord(x, y) {
        this.x = x;
        this.y = y;
    }

    draw(ctx) {
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.fillStyle = this.color;
        if (this.premove === true) {
            ctx.strokeStyle = "red";
            ctx.lineWidth = 10;
            ctx.strokeRect(this.x, this.y, this.size, this.size);
        } else {
            ctx.fillRect(this.x, this.y, this.size, this.size);
        }
    }
}

class Grid {
    constructor(game, gridSize) {
        this.game = game;
        this.gridSize = gridSize;
    }

    draw(ctx) {
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        for (let i = 1; i <= this.gridSize; i++) {
            line(ctx, PARAMS.HEIGHT * i / this.gridSize, 0, PARAMS.HEIGHT * i / this.gridSize, PARAMS.HEIGHT);
            line(ctx, 0, PARAMS.HEIGHT * i / this.gridSize, PARAMS.HEIGHT, PARAMS.HEIGHT * i / this.gridSize);
        }
    }
}
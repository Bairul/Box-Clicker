class Box {
    constructor(x, y, size, color, weight, premove) {
        Object.assign(this, { x, y, size, color, weight, premove });
    }

    updateCoord(x, y) {
        this.x = x;
        this.y = y;
    }

    draw(ctx) {
        stroke(ctx, this.color.toString());
        strokeWeight(ctx, this.weight);
        if (this.premove) {
            rect(ctx, this.x, this.y, this.size, this.size);
        } else {
            rect(ctx, this.x, this.y, this.size, this.size, this.color.toString());
        }
    }
}

class Grid {
    constructor(game, size) {
        this.game = game;
        this.size = size;
    }

    draw(ctx) {
        stroke(ctx, "black");
        strokeWeight(ctx, 1);
        for (let i = 1; i <= this.size; i++) {
            line(ctx, PARAMS.HEIGHT * i / this.size, 0, PARAMS.HEIGHT * i / this.size, PARAMS.HEIGHT);
            line(ctx, 0, PARAMS.HEIGHT * i / this.size, PARAMS.HEIGHT, PARAMS.HEIGHT * i / this.size);
        }
    }
}
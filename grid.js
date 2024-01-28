class Box {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    update() {

    }

    draw(ctx) {
        
    }
}

class Grid {
    constructor(game, gridSize) {
        this.game = game;
        this.gridSize = gridSize;
    }

    update() {

    }

    draw(ctx) {
        for(let i = 1; i <= this.gridSize; i++) {
            line(ctx, PARAMS.HEIGHT * i / this.gridSize, 0, PARAMS.HEIGHT * i / this.gridSize, PARAMS.HEIGHT);
            line(ctx, 0, PARAMS.HEIGHT * i / this.gridSize, PARAMS.HEIGHT, PARAMS.HEIGHT * i / this.gridSize);
        }
    }
}
class GameplayManager {
    constructor(game, gridSize) {
        this.game = game;
        this.gridSize = gridSize;
        this.boxSize = PARAMS.HEIGHT / gridSize;

        this.grid = new Grid(game, gridSize);
        this.preBoxColors = ["red", "blue", "lime", "yellow"];

        this.currentBox = new Box(0, 0, this.boxSize, "black");
        this.preBoxes = [];
        this.preBoxes.push(new Box(0, 0, this.boxSize, this.preBoxColors[0], true));

        this.click = false;

        this.randAllBoxes();
    }

    update() {
        if (this.game.keypress && this.game.keyclick === false) {
            this.game.keyclick = true;
            this.play();
        } 
        else if (this.game.click) {
            this.game.click = null;
            this.play();
        }
    }

    play() {
        if (!this.isOnMouse()) { // miss
            console.log("miss");
            return;
        }

        // sets current to the first pre-box
        this.currentBox.updateCoord(this.preBoxes[0].x, this.preBoxes[0].y);
        // sets the previous pre-box to the next one
        for (let i = 1; i < this.preBoxes.length; i++) {
            this.preBoxes[i - 1].updateCoord(this.preBoxes[i].x, this.preBoxes[i].y);
            this.preBoxes[i - 1].color = this.preBoxes[i].color;
        }

        this.preBoxes[this.preBoxes.length - 1].updateCoord(this.genRandGridVal(), this.genRandGridVal());
    }

    isOnMouse() {
        return this.game.mouse.x < this.currentBox.x + this.boxSize && this.game.mouse.x > this.currentBox.x
            && this.game.mouse.y < this.currentBox.y + this.boxSize && this.game.mouse.y > this.currentBox.y;
    }

    genRandGridVal() {
        return randomInt(this.gridSize) * this.boxSize;
    }

    randAllBoxes() {
        this.currentBox.updateCoord(this.genRandGridVal(), this.genRandGridVal());
        for (let i = 0; i < this.preBoxes.length; i++) {
            this.preBoxes[i].updateCoord(this.genRandGridVal(), this.genRandGridVal());
        }
    }

    draw(ctx) {
        this.grid.draw(ctx);

        this.currentBox.draw(ctx);
        for (let i = this.preBoxes.length - 1; i >= 0; i--) {
            this.preBoxes[i].draw(ctx);
        }

        ctx.fillRect(this.game.mouse.x, this.game.mouse.y, 5, 5);
    }
}
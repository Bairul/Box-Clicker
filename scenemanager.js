class SceneManager {
    constructor(game) {
        this.game = game;
        this.game.camera = this;

        this.grid = new Grid(this.game, 5);
    }

    update() {
        this.grid.update();
    }

    draw(ctx) {
        this.grid.draw(ctx);
    }
}
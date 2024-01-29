class SceneManager {
    constructor(game) {
        this.game = game;
        this.game.camera = this;

        this.menu = new Menu(game);
        this.gameplay = new GameplayManager(game, 5);
        this.startGame = false;

        this.game.addEntity(this.menu);
    }

    update() {
        if (PARAMS.START) {
            this.menu.removeFromWorld = true;
            if (this.startGame === false) {
                this.game.addEntity(this.gameplay);
            }
            this.startGame = true;
        }
    }
}
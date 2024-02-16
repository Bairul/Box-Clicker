class SceneManager {
    constructor(game) {
        this.game = game;
        this.game.camera = this;

        this.menu = new Menu(game);
        this.gameplay = new GameplayManager(game, 5);
        this.scoreboard = new Scoreboard(this.gameplay);
        this.startGame = false;
        this.firstTime = true;

        this.game.addEntity(this.menu);
    }

    update() {
        if (PARAMS.START) {
            this.menu.removeFromWorld = true;
            this.gameplay.removeFromWorld = false;
            if (!this.startGame) {
                this.game.addEntity(this.gameplay);
                this.gameplay.reset();
                if (this.firstTime) {
                    this.game.addEntity(this.scoreboard);
                    this.firstTime = false;
                }
            }
            this.startGame = true;
        } else {
            this.menu.removeFromWorld = false;
            this.gameplay.removeFromWorld = true;
            if (this.startGame) {
                this.game.addEntity(this.menu);
                if (!this.firstTime) 
                    this.menu.restart();
            }
            this.startGame = false;
        }
    }
}
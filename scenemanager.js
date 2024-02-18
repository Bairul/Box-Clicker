class SceneManager {
    constructor(game) {
        this.game = game;
        this.game.camera = this;

        this.gamemode = 0;
        this.gridsize = 5;
        this.difficluty = "";

        this.menu = new Menu(game);
        this.gameplay = new GameplayManager(game, this.gridsize);
        
        this.scoreboard = new Scoreboard(this.gameplay);
        this.startGame = false;
        this.firstTime = true;

        this.game.addEntity(this.menu);
    }

    update() {
        if (PARAMS.MENU) {
            this.gamemode = this.menu.getGamemode();
            this.gridsize = this.menu.getGridsize();
        } else if (PARAMS.START) {
            this.menu.removeFromWorld = true;
            this.gameplay.removeFromWorld = false;
            if (!this.startGame) {
                this.game.addEntity(this.gameplay);
                this.gameplay.init(this.gridsize, this.gamemode, "1");
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
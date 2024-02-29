class SceneManager {
    constructor(game) {
        this.game = game;
        this.game.camera = this;

        this.gridsize = "5";
        this.gamemode = "0";
        this.difficluty = "1";
        this.premoves = "1";
        this.allowMouse = true;
        this.showLine = false;
        this.showFade = false;

        this.menu = new Menu(game);
        this.gameplay = new GameplayManager(game, this.gamemode, this.difficluty, this.premoves, this.allowMouse, this.showLine, this.showFade);
        
        this.scoreboard = new Scoreboard(this.gameplay);
        this.startGame = false;
        this.firstTime = true;

        this.game.addEntity(this.menu);
    }

    update() {
        if (PARAMS.MENU) {
            this.gamemode = this.menu.getGamemode();
            this.gridsize = this.menu.getGridsize();
            this.difficluty = this.menu.getDifficulty();
            this.premoves = this.menu.getPremoves();
            this.allowMouse = this.menu.getMouseClick();
            this.showLine = this.menu.getShowLines();
            this.showFade = this.menu.getShowFade();
        } else if (PARAMS.START) {
            this.menu.removeFromWorld = true;
            this.gameplay.removeFromWorld = false;
            if (!this.startGame) {
                this.game.addEntity(this.gameplay);
                this.gameplay.init(this.gridsize, this.gamemode, this.difficluty, this.premoves, this.allowMouse, this.showLine, this.showFade);
                this.gameplay.reset();
                noCursor();
                if (this.firstTime) {
                    this.game.addEntity(this.scoreboard);
                    this.firstTime = false;
                    this.menu.firstTime = false;
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

    draw(ctx) {
        
    }
}
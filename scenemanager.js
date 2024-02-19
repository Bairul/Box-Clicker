class SceneManager {
    constructor(game) {
        this.game = game;
        this.game.camera = this;

        this.gamemode = "0";
        this.gridsize = "5";
        this.difficluty = "1";

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
            this.difficluty = this.menu.getDifficulty();
        } else if (PARAMS.START) {
            this.menu.removeFromWorld = true;
            this.gameplay.removeFromWorld = false;
            if (!this.startGame) {
                this.game.addEntity(this.gameplay);
                this.gameplay.init(this.gridsize, this.gamemode, this.difficluty);
                this.gameplay.reset();
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
        if (PARAMS.MENU) {
            const MENU_X = 120;
            const MENU_Y = 185;
            const SP = 16;
            rect(ctx, MENU_X, MENU_Y, 145, 152, rgb(230, 230, 230), "black");
            textSize(ctx, 12);
            text(ctx, "Classic: random", MENU_X + 2, MENU_Y + SP);
            text(ctx, "Streamy: close random", MENU_X + 2, MENU_Y + SP * 2);
            text(ctx, "Jumpy: far random", MENU_X + 2, MENU_Y + SP * 3);
            text(ctx, "Mixed: random modes", MENU_X + 2, MENU_Y + SP * 4);
            text(ctx, "Easy: no miss & life lost", MENU_X + 2, MENU_Y + SP * 6);
            text(ctx, "Normal: normal", MENU_X + 2, MENU_Y + SP * 7);
            text(ctx, "Hard: no life you lose", MENU_X + 2, MENU_Y + SP * 8);
            text(ctx, "Nightmare: miss you lose", MENU_X + 2, MENU_Y + SP * 9);
            rect(ctx, MENU_X, MENU_Y + SP * 11, 300, 85, rgb(230, 230, 230), "black");
            text(ctx, "Instructions:", MENU_X + 2, MENU_Y + SP * 12);
            text(ctx, "Click on black box using mouse click or any key press. ", MENU_X + 2, MENU_Y + SP * 13);
            text(ctx, "Your score depends on combo and health.", MENU_X + 2, MENU_Y + SP * 14);
            text(ctx, "Red square shows where the black box will be at next.", MENU_X + 2, MENU_Y + SP * 15);
            text(ctx, "Press Escape to quit current game.", MENU_X + 2, MENU_Y + SP * 16);
        }
    }
}
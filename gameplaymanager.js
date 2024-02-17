const GUI_PARAMS = {
    SCOREBOARD_WIDTH: 100,
    HEALTHBAR_SEG_LEN: 100,
    HEALTHBAR_Y: 240,
    SCOREBOARD_TEXTSIZE: 20,
}
const GAME_PARAMS = {
    SCOREBOARD_X: PARAMS.WIDTH - GUI_PARAMS.SCOREBOARD_WIDTH / 2,
    HEALTHBAR_SEG_WID: GUI_PARAMS.HEALTHBAR_SEG_LEN / 2,
    HEALTH_GAIN: GUI_PARAMS.HEALTHBAR_SEG_LEN / 3,
    MISS_COMBO: GUI_PARAMS.HEALTHBAR_SEG_LEN / 5,
    MIN_DECAYBAR: GUI_PARAMS.HEALTHBAR_Y - 5,
    MIXED_INTERVAL: 90,
};
class GameplayManager {
    constructor(game) {
        this.game = game;
        this.click = false;
        
        this.gmString = "";
        this.diffString = "";
        this.maxTime = 12;
        this.grid = new Grid(game, 5);

        this.preBoxColors = ["red", "blue", "lime", "yellow"];
        this.currentBox = new Box(0, 0, this.boxSize, "black");
        this.preBoxes = [];
        this.preBoxes.push(new Box(0, 0, this.boxSize, this.preBoxColors[0], true));

        this.init(5, 0, 1);
        this.reset();
    }

    init(gridSize, gamemode, difficulty) {
        this.grid.size = gridSize;
        this.boxSize = PARAMS.HEIGHT / gridSize;

        this.currentBox.size = this.boxSize;
        this.preBoxes.forEach(b => {
            b.size = this.boxSize;
        });
        this.randAllBoxes();

        switch(gamemode) {
            case 0:
                this.gmString = "Classic";
                break;
            case 1:
                this.gmString = "Streamy";
                break;
            case 2:
                this.gmString = "Jumpy";
                break;
            default:
                this.gmString = "Mixed";
        }

        switch(difficulty) {
            case 0:
                this.diffString = "Easy";
                break;
            case 1:
                this.diffString = "Normal";
                break;
            case 2:
                this.diffString = "Hard";
                break;
            default:
                this.diffString = "Nightmare";
        }
    }

    reset() {
        this.decayBar = 0;
        this.combo = 0;
        this.score = 0;
        this.maxCombo = 0;
        this.point = 0;
        this.time = this.maxTime;
        this.elapsed = 0;
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

        if (this.combo > this.maxCombo) {
            this.maxCombo = this.combo;
        }

        this.elapsed += this.game.clockTick;
        if (this.time == 0) {
            this.endGameplay();
        } else {
            this.time = this.maxTime - Math.floor(this.elapsed);
        }
    }

    play() {
        if (!this.isOnMouse()) { // miss
            console.log("miss");
            // broken combo
            this.combo = 0;
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

        // combo and points
        this.combo++;
        this.score += this.point * this.combo; // point system
        if (this.decayBar > GAME_PARAMS.HEALTH_GAIN) {
            this.decayBar -= GAME_PARAMS.HEALTH_GAIN;
        } else { // avoid overfill
            this.decayBar -= this.decayBar;
        }
    }

    endGameplay() {
        PARAMS.START = false;
        this.time = 0;
    }

    isOnMouse() {
        return mouseOver(this.game.mouse, this.currentBox.x, this.currentBox.y, this.boxSize, this.boxSize);
    }

    genRandGridVal() {
        return randomInt(this.grid.size) * this.boxSize;
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

class Scoreboard {
    constructor(gp) {
        this.gp = gp;
    }

    update() {
        
    }

    draw(ctx) {
        ctx.textAlign = "center";
        this.drawScoreBoard(ctx);
        this.drawCombo(ctx);
        this.drawTimer(ctx);
        ctx.textAlign = "left";
    }

    drawScoreBoard(ctx) {
        // scoreboard gui 
        stroke(ctx, 100, 100, 100);
        centerRect(ctx, GAME_PARAMS.SCOREBOARD_X, PARAMS.HEIGHT / 2, 100, PARAMS.HEIGHT, "white");
        textSize(ctx, GUI_PARAMS.SCOREBOARD_TEXTSIZE);
        stroke(ctx, 'black');
        strokeWeight(ctx, 1);
        fill(ctx, 'black');
        textSize(ctx, GUI_PARAMS.SCOREBOARD_TEXTSIZE * 1.2);
        text(ctx, this.gp.gmString, GAME_PARAMS.SCOREBOARD_X, GUI_PARAMS.SCOREBOARD_TEXTSIZE + 2);
        textSize(ctx, GUI_PARAMS.SCOREBOARD_TEXTSIZE / 3 * 2);
        text(ctx, this.gp.diffString, GAME_PARAMS.SCOREBOARD_X, GUI_PARAMS.SCOREBOARD_TEXTSIZE * 2);

        textSize(ctx, GUI_PARAMS.SCOREBOARD_TEXTSIZE);
        text(ctx, "Score:", GAME_PARAMS.SCOREBOARD_X, GUI_PARAMS.SCOREBOARD_TEXTSIZE * 3);
        text(ctx, this.gp.score, GAME_PARAMS.SCOREBOARD_X, GUI_PARAMS.SCOREBOARD_TEXTSIZE * 4);
        text(ctx, "Time:", GAME_PARAMS.SCOREBOARD_X, GUI_PARAMS.SCOREBOARD_TEXTSIZE * 5);

        text(ctx, "Combo:", GAME_PARAMS.SCOREBOARD_X, PARAMS.HEIGHT - GUI_PARAMS.SCOREBOARD_TEXTSIZE * 2);
        text(ctx, this.gp.maxCombo, GAME_PARAMS.SCOREBOARD_X, PARAMS.HEIGHT - GUI_PARAMS.SCOREBOARD_TEXTSIZE * 3);
        text(ctx, "Max:", GAME_PARAMS.SCOREBOARD_X, PARAMS.HEIGHT - GUI_PARAMS.SCOREBOARD_TEXTSIZE * 4);
    }

    drawCombo(ctx) {
        // changes color of combo to red when broken combo
        if (this.gp.combo == 0 && this.gp.score > 0) {
            fill(ctx, 'red');
            textSize(ctx, GUI_PARAMS.SCOREBOARD_TEXTSIZE * 2);
            text(ctx, this.gp.combo, GAME_PARAMS.SCOREBOARD_X, PARAMS.HEIGHT - GUI_PARAMS.SCOREBOARD_TEXTSIZE / 3);
        } else {
            fill(ctx, 'black');
            textSize(ctx, GUI_PARAMS.SCOREBOARD_TEXTSIZE);
            text(ctx, this.gp.combo, GAME_PARAMS.SCOREBOARD_X, PARAMS.HEIGHT - GUI_PARAMS.SCOREBOARD_TEXTSIZE);
        }
    }

    drawTimer(ctx) {
        // for mixed gamemode
        // if (gamemodesSelect.value() == 3 && frameCount % MIXED_INTERVAL == 0) {
        //     mixedRandMode = floor(random(0, 3));
        // }
        // changes color of countdown timer to red when less than 5 sec
        if (this.gp.time > 5) {
            text(ctx, this.gp.time, GAME_PARAMS.SCOREBOARD_X, GUI_PARAMS.SCOREBOARD_TEXTSIZE * 6);
        } else {
            fill(ctx, 'red');
            textSize(ctx, GUI_PARAMS.SCOREBOARD_TEXTSIZE * 2);
            text(ctx, this.gp.time, GAME_PARAMS.SCOREBOARD_X, GUI_PARAMS.SCOREBOARD_TEXTSIZE * 7);
        }
    }
}
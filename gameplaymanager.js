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
    MISS_DECAY: [0, 20, 40, 0],
    NATURAL_DECAY: [0, 0, 0, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3],
    POINTS: [10, 25, 50, 10, 50, 100, 50, 100, 150, 100, 200, 300],
    SIZE_MUL: [0.75, 1, 1.25, 2, 3]
};

const RECORDS =
    [
        // easy, normal, hard, night
        [0, 0, 0, 0], // classic
        [0, 0, 0, 0], // streamy
        [0, 0, 0, 0], // jumpy
        [0, 0, 0, 0], // mixed
    ];
class GameplayManager {
    constructor(game, gridSize, gamemode, difficulty, premoves, mouse, lines, fade) {
        this.game = game;
        this.click = false;
        this.frameCount = 0;
        this.allowMouse = true;

        // this.gmString = "";
        // this.diffString = "";
        this.maxTime = 30;
        this.mixedRandMode = 0;
        this.grid = new Grid(game, 5);

        this.preBoxesColorCycle = 0;
        this.preBoxColors = [new Color4(255, 0, 0, 1), new Color4(0, 0, 255, 1), new Color4(50, 205, 51, 1), new Color4(0, 255, 255, 1)];
        this.currentBox = new Box(0, 0, this.boxSize, new Color4(0, 0, 0, 1), 1);
        this.preBoxes = [];

        this.reset();
        this.init(gridSize, gamemode, difficulty, premoves, mouse, lines, fade);
    }

    init(gridSize, gamemode, difficulty, premoves, weight, mouse, lines, fade) {
        this.grid.size = parseInt(gridSize);
        this.gamemode = parseInt(gamemode);
        this.difficulty = parseInt(difficulty);
        this.premoves = parseInt(premoves);
        this.weight = parseInt(weight);
        this.allowMouse = mouse;
        this.showLines = lines;
        this.showFade = fade;

        this.boxSize = PARAMS.HEIGHT / gridSize;
        this.currentBox.size = this.boxSize;

        // sets preboxes
        this.preBoxes.length = 0;
        // there is at least 1 prebox
        this.preBoxes.push(new Box(0, 0, this.boxSize, this.preBoxColors[0], this.weight, true));
        for (let i = 1; i < this.premoves; i++) {
            this.preBoxes.push(new Box(0, 0, this.boxSize, this.preBoxColors[i], this.weight, true));
        }
        this.randAllBoxes();

        switch (this.gamemode) {
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

        switch (this.difficulty) {
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

        // reset colors
        this.preBoxesColorCycle = this.preBoxes.length - 1;
        for (let i = this.preBoxes.length - 1; i >= 0; i--) {
            this.preBoxes[i].color = this.preBoxColors[i];
        }
    }

    update() {
        if (!PARAMS.START) return;

        if (this.game.keypress && this.game.keyclick === false) {
            if (this.game.escape) {
                this.endGameplay();
                return;
            }
            this.game.keyclick = true;
            this.play();
        }
        else if (this.game.mousePressed && this.game.mouseClicked === false && this.allowMouse) {
            this.game.mouseClicked = true;
            this.play();
        }

        if (this.combo > this.maxCombo) {
            this.maxCombo = this.combo;
        }

        // framecount and timer
        this.elapsed += this.game.clockTick;
        if (this.time == 0) {
            this.endGameplay();
            return;
        } else {
            this.time = this.maxTime - Math.floor(this.elapsed);
        }

        // natural decayBar of health gets faster over time
        if (this.decayBar >= GAME_PARAMS.MIN_DECAYBAR) {
            this.decayBar = GAME_PARAMS.MIN_DECAYBAR;
            if (this.difficulty > 1) {
                this.endGameplay();
                return;
            }
        } else if (PARAMS.START) {
            if (this.time < this.maxTime / 3) {
                this.decayBar += GAME_PARAMS.NATURAL_DECAY[this.difficulty * 3 + 2];
            } else if (this.time >= this.maxTime / 3 && this.time < this.maxTime / 3 * 2) {
                this.decayBar += GAME_PARAMS.NATURAL_DECAY[this.difficulty * 3 + 1];
            } else {
                this.decayBar += GAME_PARAMS.NATURAL_DECAY[this.difficulty * 3];
            }
        }

        // for mixed gamemode
        if (this.gamemode === 3 && this.frameCount % GAME_PARAMS.MIXED_INTERVAL === 0) {
            this.mixedRandMode = randomInt(3);
            this.frameCount = 1;
        }
        this.frameCount++;
    }

    play() {
        if (!this.isOnMouse()) { // miss
            console.log("miss");
            if (this.difficulty === 3) {
                this.endGameplay();
                return;
            } else if (this.difficulty > 0) {
                // broken combo
                this.combo = 0;
                this.decayBar += GAME_PARAMS.MISS_DECAY[this.difficulty];
            }
            return;
        }

        // sets current to the first pre-box
        this.currentBox.updateCoord(this.preBoxes[0].x, this.preBoxes[0].y);
        // sets the previous pre-box to the next one
        for (let i = 1; i < this.preBoxes.length; i++) {
            this.preBoxes[i - 1].updateCoord(this.preBoxes[i].x, this.preBoxes[i].y);
            this.preBoxes[i - 1].color = this.preBoxes[i].color;
        }

        this.preBoxesColorCycle = (this.preBoxesColorCycle + 1) % this.preBoxes.length;
        this.preBoxes[this.preBoxes.length - 1].color = this.preBoxColors[this.preBoxesColorCycle];

        // sets last pre-box to another location depending on gamemode
        if (this.gamemode === 0 || (this.gamemode === 3 && this.mixedRandMode === 0)) {
            this.preBoxes[this.preBoxes.length - 1].updateCoord(this.genRandGridVal(), this.genRandGridVal());
        } else if (this.gamemode === 1 || (this.gamemode === 3 && this.mixedRandMode === 1)) {
            this.streamy();
        } else if (this.gamemode === 2 || (this.gamemode === 3 && this.mixedRandMode === 2)) {
            this.jumpy();
        }

        // combo and points
        this.combo++;
        this.score += this.point * this.combo * GAME_PARAMS.SIZE_MUL[this.grid.size - 4]; // point system
        if (this.decayBar > GAME_PARAMS.HEALTH_GAIN) {
            this.decayBar -= GAME_PARAMS.HEALTH_GAIN;
        } else { // avoid overfill
            this.decayBar -= this.decayBar;
        }
    }

    streamy() {
        let randX = randomInt(3) - 1;
        let randY = randomInt(3) - 1;
        let newX = this.preBoxes[this.preBoxes.length - 1].x + randX * this.boxSize;
        let newY = this.preBoxes[this.preBoxes.length - 1].y + randY * this.boxSize;
        while (newX > PARAMS.WIDTH - GUI_PARAMS.SCOREBOARD_WIDTH - 1 || newX < 0) {
            randX = randomInt(3) - 1;
            newX = this.preBoxes[this.preBoxes.length - 1].x + randX * this.boxSize;
        }
        while (newY > PARAMS.HEIGHT - 1 || newY < 0) {
            randY = randomInt(3) - 1;
            newY = this.preBoxes[this.preBoxes.length - 1].y + randY * this.boxSize;
        }
        this.preBoxes[this.preBoxes.length - 1].updateCoord(newX, newY);
    }

    jumpy() {
        let newX = this.genRandGridVal();
        let newY = this.genRandGridVal();

        while (Math.abs(this.preBoxes[this.preBoxes.length - 1].x - newX) < this.boxSize - 1) {
            newX = this.genRandGridVal();
        }
        while (Math.abs(this.preBoxes[this.preBoxes.length - 1].y - newY) < this.boxSize - 1) {
            newY = this.genRandGridVal();
        }

        this.preBoxes[this.preBoxes.length - 1].updateCoord(newX, newY);
    }

    endGameplay() {
        PARAMS.START = false;
        this.time = 0;
        if (this.score > RECORDS[this.gamemode][this.difficulty]) {
            RECORDS[this.gamemode][this.difficulty] = this.score;
        }
        cursor();
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
            this.preBoxes[i].color.a = 1 / (this.showFade ? (i + 1) : 1);
            this.preBoxes[i].draw(ctx);
        }

        // draw cursor
        stroke(ctx, "red");
        strokeWeight(ctx, this.weight / 2);
        line(ctx, this.game.mouse.x, this.game.mouse.y, this.game.pmouse.x, this.game.pmouse.y);

        if (this.showLines && this.preBoxes.length > 0) {
            for (let i = this.preBoxes.length - 1; i > 0; i--) {
                stroke(ctx, this.preBoxes[i].color.toString());
                strokeWeight(ctx, this.weight);
                line(ctx, this.preBoxes[i - 1].x + this.boxSize / 2, this.preBoxes[i - 1].y + this.boxSize / 2, this.preBoxes[i].x + this.boxSize / 2, this.preBoxes[i].y + this.boxSize / 2);
            }
            stroke(ctx, this.preBoxes[0].color.toString());
            line(ctx, this.currentBox.x + this.boxSize / 2, this.currentBox.y + this.boxSize / 2, this.preBoxes[0].x + this.boxSize / 2, this.preBoxes[0].y + this.boxSize / 2);
        }
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
        this.drawHealthBar(ctx);
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
        if (PARAMS.START) {
            text(ctx, "Score:", GAME_PARAMS.SCOREBOARD_X, GUI_PARAMS.SCOREBOARD_TEXTSIZE * 3);
            text(ctx, this.gp.score, GAME_PARAMS.SCOREBOARD_X, GUI_PARAMS.SCOREBOARD_TEXTSIZE * 4);
        } else {
            text(ctx, "Highscore:", GAME_PARAMS.SCOREBOARD_X, GUI_PARAMS.SCOREBOARD_TEXTSIZE * 3);
            text(ctx, RECORDS[this.gp.gamemode][this.gp.difficulty], GAME_PARAMS.SCOREBOARD_X, GUI_PARAMS.SCOREBOARD_TEXTSIZE * 4);
            text(ctx, "Score:", PARAMS.WIDTH / 2 - 50, PARAMS.HEIGHT / 2 + 40);
            text(ctx, this.gp.score, PARAMS.WIDTH / 2 - 50, PARAMS.HEIGHT / 2 + 60);
        }

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
        // changes color of countdown timer to red when less than 5 sec
        if (this.gp.time > 5) {
            fill(ctx, 'black');
            textSize(ctx, GUI_PARAMS.SCOREBOARD_TEXTSIZE);
            text(ctx, this.gp.time, GAME_PARAMS.SCOREBOARD_X, GUI_PARAMS.SCOREBOARD_TEXTSIZE * 6);
        } else {
            fill(ctx, 'red');
            textSize(ctx, GUI_PARAMS.SCOREBOARD_TEXTSIZE * 2);
            text(ctx, this.gp.time, GAME_PARAMS.SCOREBOARD_X, GUI_PARAMS.SCOREBOARD_TEXTSIZE * 7);
        }
    }

    drawHealthBar(ctx) {
        // rectMode(CORNER);
        let gaugeX = PARAMS.WIDTH - GUI_PARAMS.SCOREBOARD_WIDTH + (GUI_PARAMS.SCOREBOARD_WIDTH - GAME_PARAMS.HEALTHBAR_SEG_WID) / 2;
        // draw healthbar gauge
        for (let i = 0; i <= 2; i++) {
            rect(ctx, gaugeX, PARAMS.HEIGHT / 2 - GUI_PARAMS.HEALTHBAR_SEG_LEN, GAME_PARAMS.HEALTHBAR_SEG_WID, GUI_PARAMS.HEALTHBAR_Y - i *
                (GUI_PARAMS.HEALTHBAR_Y / 3), rgb(180, 180, 180), "black");
        }

        let color = "";
        // point decreases as health drops to encourage maintaining health
        if (this.gp.decayBar <= GUI_PARAMS.HEALTHBAR_Y / 3) {
            color = rgba(50, 100, 255, 0.5); // blue
            this.gp.point = GAME_PARAMS.POINTS[this.gp.difficulty * 3 + 2];
        } else if (this.gp.decayBar > GUI_PARAMS.HEALTHBAR_Y / 3 && this.gp.decayBar < GUI_PARAMS.HEALTHBAR_Y / 3 * 2) {
            color = rgba(100, 255, 50, 0.5); // green
            this.gp.point = GAME_PARAMS.POINTS[this.gp.difficulty * 3 + 1];
        } else {
            color = rgba(255, 0, 0, 0.5); // red
            this.gp.point = GAME_PARAMS.POINTS[this.gp.difficulty * 3];
        }
        // decay bar
        rect(ctx, gaugeX, PARAMS.HEIGHT / 2 - GUI_PARAMS.HEALTHBAR_SEG_LEN + this.gp.decayBar, GAME_PARAMS.HEALTHBAR_SEG_WID, GUI_PARAMS.HEALTHBAR_Y - this.gp.decayBar, color, "gray");
    }
}
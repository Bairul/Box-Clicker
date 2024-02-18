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
        this.frameCount = 0;
        
        this.gmString = "";
        this.gamemode = 0;
        this.difficulty = 1;
        this.mixedRandMode = 0;
        this.diffString = "";
        this.maxTime = 9;
        this.grid = new Grid(game, 5);

        this.preBoxColors = ["red", "blue", "lime", "yellow"];
        this.currentBox = new Box(0, 0, this.boxSize, "black");
        this.preBoxes = [];
        this.preBoxes.push(new Box(0, 0, this.boxSize, this.preBoxColors[0], true));

        this.init("5", "0", "1");
        this.reset();
    }

    init(gridSize, gamemode, difficulty) {
        this.grid.size = parseInt(gridSize);
        this.gamemode = parseInt(gamemode);
        this.difficulty = parseInt(difficulty);

        this.boxSize = PARAMS.HEIGHT / gridSize;
        this.currentBox.size = this.boxSize;
        this.preBoxes.forEach(b => {
            b.size = this.boxSize;
        });
        this.randAllBoxes();

        switch(this.gamemode) {
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

        switch(this.difficulty) {
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
        this.score += this.point * this.combo; // point system
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
            color = rgba(50, 100, 255, 120); // blue
            this.gp.point = 100;
        } else if (this.gp.decayBar > GUI_PARAMS.HEALTHBAR_Y / 3 && this.gp.decayBar < GUI_PARAMS.HEALTHBAR_Y / 3 * 2) {
            color = rgba(100, 255, 50, 120); // green
            this.gp.point = 50;
        } else {
            color = rgba(255, 0, 0, 120); // red
            this.gp.point = 10;
        }
        // natural decayBar of health gets faster over time
        if (this.gp.decayBar >= GAME_PARAMS.MIN_DECAYBAR) {
            this.gp.decayBar = GAME_PARAMS.MIN_DECAYBAR;
        } else if (PARAMS.START) {
            if (this.gp.time < this.gp.maxTime / 3) {
                this.gp.decayBar += 3
            } else if (this.gp.time >= this.gp.maxTime / 3 && this.gp.time < this.gp.maxTime / 3 * 2) {
                this.gp.decayBar += 2
            } else {
                this.gp.decayBar += 1
            }
        }
        // decay bar
        rect(ctx, gaugeX, PARAMS.HEIGHT / 2 - GUI_PARAMS.HEALTHBAR_SEG_LEN + this.gp.decayBar, GAME_PARAMS.HEALTHBAR_SEG_WID, GUI_PARAMS.HEALTHBAR_Y - this.gp.decayBar, color, "gray");
    }
}
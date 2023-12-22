const HEIGHT = 500;
        const WIDTH = 600;
        const MIN_PADDING = 8;
        const DEFAULT_TIME = 30;
        const DEFAULT_GRID_SIZE = 5;

        const SCOREBOARD_WIDTH = 100;
        const SCOREBOARD_X = WIDTH - SCOREBOARD_WIDTH / 2;
        const SCOREBOARD_TEXTSIZE = 20;
        const HEALTHBAR_Y = 240;
        const HEALTHBAR_SEG_LEN = 100;
        const HEALTHBAR_SEG_WID = HEALTHBAR_SEG_LEN / 2;
        const HEALTH_GAIN = HEALTHBAR_SEG_LEN / 3;
        const MIN_DECAYBAR = HEALTHBAR_Y - 5;
        const MIXED_INTERVAL = 90;

        const MENU_X = 150;
        const MENU_Y = 185;
        const BUTTON_HEIGHT = 30;
        const CURSOR_COLOR = 'red';
        const SLIDER_LENGTH = 100;
        const COLOR_PICK_SIZE = 25;
        const DEFAULT_WEIGHT = 4;
        
        let canvasPaddingX = 0;
        let canvasPaddingY = 0;
        let startGame = false;
        let firstGame = true;
        let i;

        // gameplay variables
        let boxSize = HEIGHT / DEFAULT_GRID_SIZE;
        let gridSize = DEFAULT_GRID_SIZE;
        let maxTime = DEFAULT_TIME;
        let time = DEFAULT_TIME;
        let score = 0;
        let highScore = 0;
        let combo = 0;
        let maxCombo = 0;
        let decayBar = 0;
        let point = 0; // point earned per successful hit
        let mixedRandMode = 1;
        let preBoxesColorCycle = 0;
        // objects
        let currentBox;
        let preBoxes = [];
        let preBoxColors = ['red', 'orange', 'blue', 'purple'];

        // buttons
        let startButton;
        let restartButton;
        let menuButton;
        let backButton;
        let isInMenu = false;
        // radios
        let gamemodesRadio;
        // sliders
        let gridSizeSlider;
        let preBoxSlider;
        let preBoxWeightSlider;
        let timeSlider;
        // checkboxes
        let showLinesCheck;
        let showTransCheck;
        // colors
        let cursorColorPick;
        let preBoxColorPicks = [];
        
        function setup() {
            canvasPaddingX = max(MIN_PADDING, (window.innerWidth - WIDTH) / 2);
            canvasPaddingY = max(MIN_PADDING, (window.innerHeight - HEIGHT) / 2);
            canvas = createCanvas(WIDTH, HEIGHT);
            canvas.position(canvasPaddingX, canvasPaddingY);
            rectMode(CENTER);
            textAlign(CENTER);

            // dom stuff
            startButton = createButton("Start");
            restartButton = createButton("Restart");
            menuButton = createButton("Menu");
            backButton = createButton("Back");
            gamemodesRadio = createRadio();
            showLinesCheck = createCheckbox();
            showTransCheck = createCheckbox();
            gridSizeSlider = createSlider(4, 8, gridSize, 1);
            preBoxSlider = createSlider(0, preBoxColors.length, 1, 1);
            preBoxWeightSlider = createSlider(4, 12, DEFAULT_WEIGHT, 2);
            timeSlider = createSlider(10, DEFAULT_TIME * 2, DEFAULT_TIME, 5);

            // set button size and position
            startButton.size(80, BUTTON_HEIGHT);
            restartButton.size(90, BUTTON_HEIGHT);
            menuButton.size(60, BUTTON_HEIGHT);
            backButton.size(60, BUTTON_HEIGHT);
            gridSizeSlider.size(SLIDER_LENGTH);
            preBoxSlider.size(SLIDER_LENGTH);
            preBoxWeightSlider.size(SLIDER_LENGTH);
            timeSlider.size(SLIDER_LENGTH);

            menuButton.position(canvasPaddingX, canvasPaddingY);

            // button functions
            restartButton.mouseClicked(initGame);
            startButton.mouseClicked(initGame);
            menuButton.mouseClicked(menuChoose);
            backButton.mouseClicked(backGame);

            // gamemodesRadio
            gamemodesRadio.option('  Classic ', 1);
            gamemodesRadio.option('  Streamy ', 2);
            gamemodesRadio.option('  Jumpy ', 3);
            gamemodesRadio.option('  Mixed ', 4);
            gamemodesRadio.selected(1);

            // objects
            currentBox = new BOX(0, 0, 'black');
            preBoxes.push(new PRE_BOX(0, 0, preBoxColors[0]));

            cursorColorPick = createColorPicker(CURSOR_COLOR);
            cursorColorPick.size(COLOR_PICK_SIZE, COLOR_PICK_SIZE);
            for (i = 0; i < preBoxColors.length; i++) {
                preBoxColorPicks.push(createColorPicker(preBoxColors[i]));
                preBoxColorPicks[i].position(-WIDTH, -HEIGHT);
                preBoxColorPicks[i].size(COLOR_PICK_SIZE, COLOR_PICK_SIZE);
            }

            // hide positions
            hideMenuGui();
            // attribute('disabled', '');
            // removeAttribute('disabled');
        }

        function drawHealthBar(basedecayBar) {
            rectMode(CORNER);
            let gaugeX = WIDTH - SCOREBOARD_WIDTH + (SCOREBOARD_WIDTH - HEALTHBAR_SEG_WID) / 2;
            // draw healthbar gauge
            fill(180);
            for (i = 0; i <= 2; i++) {
                rect(gaugeX, HEIGHT / 2 - HEALTHBAR_SEG_LEN, HEALTHBAR_SEG_WID, HEALTHBAR_Y - i * 
                                                                                (HEALTHBAR_Y / 3));
            }

            // point decreases as health drops to encourage maintaining health
            if (decayBar <= HEALTHBAR_Y / 3) {
                fill(50, 100, 255, 120); // blue
                point = 100;
            } else if (decayBar > HEALTHBAR_Y / 3 && decayBar < HEALTHBAR_Y / 3 * 2) {
                fill(100, 255, 50, 120); // green
                point = 50;
            } else {
                fill(255, 0, 0, 120); // red
                point = 10;
            }
            // natural decayBar of health gets faster over time
            if (decayBar >= MIN_DECAYBAR) {
                decayBar = MIN_DECAYBAR;
            } else {
                if (time < DEFAULT_TIME / 3) {
                    decayBar += basedecayBar + 1;
                } else if (time >= DEFAULT_TIME / 3 && time < DEFAULT_TIME / 3 * 2) {
                    decayBar += basedecayBar + 0.5;
                } else {
                    decayBar += basedecayBar;
                }
            }
            // decay bar
            rect(gaugeX, HEIGHT / 2 - HEALTHBAR_SEG_LEN + decayBar, HEALTHBAR_SEG_WID, HEALTHBAR_Y - decayBar);

            rectMode(CENTER);
        }

        function drawBoxes() {
            currentBox.display();
            for (i = preBoxes.length - 1; i >= 0; i--) {
                preBoxes[i].display(preBoxWeightSlider.value(), 255 / (showTransCheck.checked() ? (i + 1) : 1));
            }
        }

        function drawPreBoxLines() {
            if (!showLinesCheck.checked()) {
                return;
            }
            for (i = preBoxes.length - 1; i > 0; i--) {
                stroke(preBoxes[i].c);
                line(preBoxes[i - 1].x, preBoxes[i - 1].y, preBoxes[i].x, preBoxes[i].y);
            }
            stroke(preBoxes[0].c);
            line(currentBox.x, currentBox.y, preBoxes[0].x, preBoxes[0].y);
        }

        function drawScoreBoard() {
            if (score > highScore) {
                highScore = score;
            }
            if (combo > maxCombo) {
                maxCombo = combo;
            }

            // scoreboard gui 
            stroke(100, 100, 100);
            fill('white');
            rect(SCOREBOARD_X, HEIGHT / 2, 100, HEIGHT);
            textSize(SCOREBOARD_TEXTSIZE);
            stroke('black');
            strokeWeight(1);
            fill('black');
            text("Highscore:", SCOREBOARD_X, SCOREBOARD_TEXTSIZE);
            text(highScore, SCOREBOARD_X, SCOREBOARD_TEXTSIZE * 2);
            text("Score:", SCOREBOARD_X, SCOREBOARD_TEXTSIZE * 3);
            text(score, SCOREBOARD_X, SCOREBOARD_TEXTSIZE * 4);
            text("Time:", SCOREBOARD_X, SCOREBOARD_TEXTSIZE * 5);
            
            text("Combo:", SCOREBOARD_X, HEIGHT - SCOREBOARD_TEXTSIZE * 2);
            text(maxCombo, SCOREBOARD_X, HEIGHT - SCOREBOARD_TEXTSIZE * 3);
            text("Max:", SCOREBOARD_X, HEIGHT - SCOREBOARD_TEXTSIZE * 4);

            drawTimer();
            drawCombo();
        }

        function drawTimer() {
            if (time == 0) {
                startGame = false;
            } else if (frameCount % 60 == 0) {
                time--;
            }

            // for mixed gamemode
            if (gamemodesRadio.value() == 4 && frameCount % MIXED_INTERVAL == 0) {
                mixedRandMode = floor(random(1, 4));
            }
            // changes color of countdown timer to red when less than 5 sec
            if (time > 5) {
                text(time, SCOREBOARD_X, SCOREBOARD_TEXTSIZE * 6);
            } else {
                fill('red');
                textSize(SCOREBOARD_TEXTSIZE * 2);
                text(time, SCOREBOARD_X, SCOREBOARD_TEXTSIZE * 7);
            }
        }

        function drawCombo() {
            // changes color of combo to red when broken combo
            if (combo == 0 && score > 0) {
                fill('red');
                textSize(SCOREBOARD_TEXTSIZE * 2);
                text(combo, SCOREBOARD_X, HEIGHT - SCOREBOARD_TEXTSIZE / 3);
            } else {
                fill('black');
                textSize(SCOREBOARD_TEXTSIZE);
                text(combo, SCOREBOARD_X, HEIGHT - SCOREBOARD_TEXTSIZE);
            }
        }

        function drawGrid() { // background grid
            strokeWeight(3);
            stroke(100, 100, 100);
            for(i = 1; i <= gridSize; i++) {
                line(HEIGHT * i / gridSize, 0, HEIGHT * i / gridSize, HEIGHT);
                line(0, HEIGHT * i / gridSize, HEIGHT, HEIGHT * i / gridSize);
            }
        }

        function drawCursor() {
            noCursor();
            stroke(cursorColorPick.color());
            strokeWeight(5);
            line(mouseX, mouseY, pmouseX, pmouseY);
        }

        function updateMenuPositions() {
            const vertPad = 28;
            const vertPadSlid = 60;
            const vomMenuX = canvasPaddingX + MENU_X;
            const vomSlidX = MENU_X + SLIDER_LENGTH * 2;

            backButton.position(canvasPaddingX, canvasPaddingY);
            gamemodesRadio.position(vomMenuX, canvasPaddingY + 100);
            gridSizeSlider.position(vomMenuX, canvasPaddingY + 150);
            timeSlider.position(    vomMenuX, canvasPaddingY + 150 + vertPadSlid);
            preBoxSlider.position(vomMenuX + SLIDER_LENGTH * 2, canvasPaddingY + 150);
            showLinesCheck.position(vomMenuX + SLIDER_LENGTH * 2 + 75, canvasPaddingY + 199);
            showTransCheck.position(vomMenuX + SLIDER_LENGTH * 2 + 75, canvasPaddingY + 227);
            preBoxWeightSlider.position(vomMenuX + SLIDER_LENGTH * 2, canvasPaddingY + 345);

            textAlign(LEFT);
            textSize(SCOREBOARD_TEXTSIZE / 1.5);
            fill('black');
            strokeWeight(0.25);
            text("Size: " + gridSizeSlider.value(), MENU_X, MENU_Y);
            text("Time: " + timeSlider.value(),     MENU_X, MENU_Y + vertPadSlid);
            text("Premove: " + preBoxSlider.value(), vomSlidX, MENU_Y);
            text("Show Lines:",     vomSlidX, MENU_Y + vertPad);
            text("Transparent:",    vomSlidX, MENU_Y + vertPad * 2);
            text("Cursor:",         vomSlidX, MENU_Y + vertPad * 3);
            text("Premove Colors:", vomSlidX, MENU_Y + vertPad * 4);
            text("Weight: " + preBoxWeightSlider.value(), vomSlidX, MENU_Y + vertPad * 7);
            // colors
            cursorColorPick.position(vomMenuX + SLIDER_LENGTH * 2 + 68, canvasPaddingY + 224 + vertPad);
            for (i = 0; i < preBoxColorPicks.length; i++) {
                preBoxColorPicks[i].position(vomMenuX + SLIDER_LENGTH * 2 + i * 30, canvasPaddingY + 280 + vertPad);
                text(i + 1, vomSlidX + 8 + i * 30, MENU_Y + vertPad * 5)
            }
            textAlign(CENTER);
        }

        // objects

        function BOX(initX, initY, color) {
            this.x = initX;
            this.y = initY;
            this.c = color;

            this.display = function() {
                fill(this.c);
                noStroke();
                rect(this.x, this.y, boxSize, boxSize);
            }

            this.setPos = function(newX, newY) {
                this.x = newX;
                this.y = newY;
            }
        }

        function PRE_BOX(initX, initY, color) {
            this.x = initX;
            this.y = initY;
            this.c = color;

            this.display = function(weight, transparency) {
                noFill();
                stroke(red(this.c), green(this.c), blue(this.c), transparency);
                strokeWeight(weight);
                rect(this.x + weight / 4, this.y + weight / 4, boxSize - weight / 2, boxSize - weight / 2);
            }

            this.setPos = function(newX, newY) {
                this.x = newX;
                this.y = newY;
            }
        }

        // gameloop
        function draw() {
            background(175, 200, 255);

            if (startGame) {
                drawGrid();
                drawScoreBoard();
                drawHealthBar(1);
                drawBoxes();
                drawPreBoxLines();
                drawCursor();
            } else {
                cursor();
                if (isInMenu) {
                    updateMenuPositions();
                    return;
                }
                menuButton.position(canvasPaddingX, canvasPaddingY);

                if (firstGame) {
                    startButton.position(canvasPaddingX + WIDTH / 2 - 40, canvasPaddingY + HEIGHT / 2 - BUTTON_HEIGHT / 2);
                } else {
                    drawScoreBoard();
                    drawHealthBar(-1);
                    restartButton.position(canvasPaddingX + WIDTH / 2 - 90, canvasPaddingY + HEIGHT / 2 - BUTTON_HEIGHT / 2);
                }
            }
        }

        // when start or restart button is clicked
        function initGame() {
            startGame = true;
            firstGame = false;
            time = maxTime;
            decayBar = 0;
            combo = 0;
            score = 0;
            // reset colors
            preBoxesColorCycle = preBoxes.length - 1;
            for (i = preBoxes.length - 1; i >= 0; i--) {
                preBoxes[i].c = preBoxColors[i];
            }

            // get buttons out of sight
            startButton.position(-WIDTH, -HEIGHT);
            restartButton.position(-WIDTH, -HEIGHT);
            menuButton.position(-WIDTH, -HEIGHT);

            // initial box positions
            randAllBoxes();
        }

        function gameplay() {
            if (!isOnMouse(currentBox.x, currentBox.y)) { // miss
                // broken combo
                combo = 0;
                decayBar += 20;
                return;
            }

            // sets current to the first pre-box
            if (preBoxes.length == 0) {
                currentBox.setPos(genRandGridVal(), genRandGridVal());
            } else {
                currentBox.setPos(preBoxes[0].x, preBoxes[0].y);
                // sets the previous pre-box to the next one
                for (i = 1; i < preBoxes.length; i++) {
                    preBoxes[i - 1].setPos(preBoxes[i].x, preBoxes[i].y);
                    preBoxes[i - 1].c = preBoxes[i].c;
                }

                // sets last pre-box to another location depending on gamemode
                if (gamemodesRadio.value() == 1 || (gamemodesRadio.value() == 4 && mixedRandMode == 1)) {
                    preBoxes[preBoxes.length - 1].setPos(genRandGridVal(), genRandGridVal());
                } else if (gamemodesRadio.value() == 2 || (gamemodesRadio.value() == 4 && mixedRandMode == 2)) {
                    streamy();
                } else if (gamemodesRadio.value() == 3 || (gamemodesRadio.value() == 4 && mixedRandMode == 3)) {
                    jumpy();
                }
                preBoxesColorCycle = (preBoxesColorCycle + 1) % preBoxes.length;
                preBoxes[preBoxes.length - 1].c = preBoxColors[preBoxesColorCycle];
            }

            // combo and points
            combo++;
            score += point * combo; // point system
            if (decayBar > HEALTH_GAIN) {
                decayBar -= HEALTH_GAIN;
            } else { // avoid overfill
                decayBar -= decayBar;
            }
        }

        function streamy() {
            let randX = floor(random(0, 3)) - 1;
            let randY = floor(random(0, 3)) - 1;
            let newX = preBoxes[preBoxes.length - 1].x + randX * boxSize;
            let newY = preBoxes[preBoxes.length - 1].y + randY * boxSize;
            while (newX > WIDTH - SCOREBOARD_WIDTH || newX < 0) {
                randX = floor(random(0, 3)) - 1;
                newX = preBoxes[preBoxes.length - 1].x + randX * boxSize;
            }
            while (newY > HEIGHT || newY < 0) {
                randY = floor(random(0, 3)) - 1;
                newY = preBoxes[preBoxes.length - 1].y + randY * boxSize;
            }
            preBoxes[preBoxes.length - 1].setPos(newX, newY);
        }

        function jumpy() {
            let newX = genRandGridVal();
            let newY = genRandGridVal();

            while (abs(preBoxes[preBoxes.length - 1].x - newX) < boxSize) {
                newX = genRandGridVal();
            }
            while (abs(preBoxes[preBoxes.length - 1].y - newY) < boxSize) {
                newY = genRandGridVal();
            }

            preBoxes[preBoxes.length - 1].setPos(newX, newY);
        }

        function isOnMouse(x, y) {
            return mouseX < x + boxSize / 2 && mouseX > x - boxSize / 2
                && mouseY < y + boxSize / 2 && mouseY > y - boxSize / 2;
        }

        function randAllBoxes() {
            currentBox.setPos(genRandGridVal(), genRandGridVal());
            for (i = 0; i < preBoxes.length; i++) {
                preBoxes[i].setPos(genRandGridVal(), genRandGridVal());
            }
        }

        function genRandGridVal() {
            return (floor(random(0, gridSize)) + 0.5) * boxSize;
        }

        function keyPressed() {
            if (!startGame) {
                return;
            }

            if (keyCode == ESCAPE) {
                startGame = false;
                time = 0;
                return;
            }
            gameplay();
        }

        function mousePressed() {
            if (!startGame) {
                return;
            }
            gameplay();
        }

        // buttons
        // when menu button is clicked
        function menuChoose() {
            isInMenu = true;
            startButton.position(-WIDTH, -HEIGHT);
            restartButton.position(-WIDTH, -HEIGHT);
            menuButton.position(-WIDTH, -HEIGHT);
            updateMenuPositions();
        }
        // when back button is clicked
        function backGame() {
            isInMenu = false;
            menuButton.position(canvasPaddingX, canvasPaddingY);
            hideMenuGui();

            for (i = 0; i < preBoxColors.length; i++) {
                preBoxColorPicks[i].position(-WIDTH, -HEIGHT);
                preBoxColors[i] = preBoxColorPicks[i].color();
            }

            // sets grid size and box size
            gridSize = gridSizeSlider.value();
            boxSize = HEIGHT / gridSize;

            // sets preboxes
            preBoxes.splice(0, preBoxes.length);
            for (i = 0; i < preBoxSlider.value(); i++) {
                preBoxes.push(new PRE_BOX(0, 0, preBoxColors[i]));
            }
            // set time
            maxTime = timeSlider.value();
        }

        function hideMenuGui() {
            restartButton.position(-WIDTH, -HEIGHT);
            backButton.position(-WIDTH, -HEIGHT);
            gridSizeSlider.position(-WIDTH, -HEIGHT);
            preBoxSlider.position(-WIDTH, -HEIGHT);
            preBoxWeightSlider.position(-WIDTH, -HEIGHT);
            timeSlider.position(-WIDTH, -HEIGHT);
            gamemodesRadio.position(-WIDTH, -HEIGHT);
            showLinesCheck.position(-WIDTH, -HEIGHT);
            showTransCheck.position(-WIDTH, -HEIGHT);
            cursorColorPick.position(-WIDTH, -HEIGHT);
        }

        // allow dynamic canvas resizing
        window.onresize = function() { 
            canvasPaddingX = max(MIN_PADDING, (window.innerWidth - WIDTH) / 2);
            canvasPaddingY = max(MIN_PADDING, (window.innerHeight - HEIGHT) / 2);
            canvas.position(canvasPaddingX, canvasPaddingY);
        }
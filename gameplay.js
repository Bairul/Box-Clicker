
function drawHealthBar() {
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
    } else if (startGame) {
        if (time < maxTime / 3) {
            decayBar += DIFFICULTYS[difficultySelect.value() * 3 + 2];
        } else if (time >= maxTime / 3 && time < maxTime / 3 * 2) {
            decayBar += DIFFICULTYS[difficultySelect.value() * 3 + 1];
        } else {
            decayBar += DIFFICULTYS[difficultySelect.value() * 3];
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
    if (!showLinesCheck.checked() || preBoxes.length == 0) {
        return;
    }
    for (i = preBoxes.length - 1; i > 0; i--) {
        stroke(preBoxes[i].c);
        strokeWeight(preBoxWeightSlider.value());
        line(preBoxes[i - 1].x, preBoxes[i - 1].y, preBoxes[i].x, preBoxes[i].y);
    }
    stroke(preBoxes[0].c);
    line(currentBox.x, currentBox.y, preBoxes[0].x, preBoxes[0].y);
}

function drawScoreBoard() {
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
    textSize(SCOREBOARD_TEXTSIZE * 1.2);
    text(gmString, SCOREBOARD_X, SCOREBOARD_TEXTSIZE + 2);
    textSize(SCOREBOARD_TEXTSIZE / 3 * 2);
    text(diffString, SCOREBOARD_X, SCOREBOARD_TEXTSIZE * 2);

    textSize(SCOREBOARD_TEXTSIZE);
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
    if (startGame) {
        if (time == 0) {
            endGameplay();
        } else if (frameCount % 60 == 0) {
            time--;
        }
    }

    // for mixed gamemode
    if (gamemodesSelect.value() == 3 && frameCount % MIXED_INTERVAL == 0) {
        mixedRandMode = floor(random(0, 3));
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
        drawHealthBar();
        drawBoxes();
        drawPreBoxLines();
        drawCursor();
    } else {
        cursor();
        if (isInRecords) {
            updateRecordsPositions();
            return;
        }
        if (isInMenu) {
            updateMenuPositions();
            return;
        }
        
        menuButton.position(canvasPaddingX, canvasPaddingY);

        if (firstGame) {
            startButton.position(canvasPaddingX + WIDTH / 2 - 40, canvasPaddingY + HEIGHT / 2 - BUTTON_HEIGHT / 2);
            recordsButton.position(canvasPaddingX + WIDTH - 80, canvasPaddingY);
        } else {
            drawScoreBoard();
            drawHealthBar();
            restartButton.position(canvasPaddingX + WIDTH / 2 - 90, canvasPaddingY + HEIGHT / 2 - BUTTON_HEIGHT / 2);
            recordsButton.position(canvasPaddingX + WIDTH - SCOREBOARD_WIDTH - 80, canvasPaddingY);
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
    maxCombo = 0;
    // reset colors
    preBoxesColorCycle = preBoxes.length - 1;
    for (i = preBoxes.length - 1; i >= 0; i--) {
        preBoxes[i].c = preBoxColors[i];
    }

    // get buttons out of sight
    startButton.position(-WIDTH, -HEIGHT);
    restartButton.position(-WIDTH, -HEIGHT);
    menuButton.position(-WIDTH, -HEIGHT);
    recordsButton.position(-WIDTH, -HEIGHT);

    // initial box positions
    randAllBoxes();
}

function gameplay() {
    if (!isOnMouse(currentBox.x, currentBox.y)) { // miss
        if (difficultySelect.value() == 3) { // nightmare mode
            endGameplay();
            return;
        }
        // broken combo
        combo = 0;
        decayBar += MISS_COMBO * difficultySelect.value(); // doesnt go down on easy
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
        if (gamemodesSelect.value() == 0 || (gamemodesSelect.value() == 3 && mixedRandMode == 0)) {
            preBoxes[preBoxes.length - 1].setPos(genRandGridVal(), genRandGridVal());
        } else if (gamemodesSelect.value() == 1 || (gamemodesSelect.value() == 3 && mixedRandMode == 1)) {
            streamy();
        } else if (gamemodesSelect.value() == 2 || (gamemodesSelect.value() == 3 && mixedRandMode == 2)) {
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

function endGameplay() {
    startGame = false;
    time = 0;
    // update records
    const recordScore = RECORDS[gamemodesSelect.value()][difficultySelect.value() * 5];
    if (score > recordScore) {
        RECORDS[gamemodesSelect.value()][difficultySelect.value() * 5] = score;
        RECORDS[gamemodesSelect.value()][difficultySelect.value() * 5 + 1] = maxCombo;
        RECORDS[gamemodesSelect.value()][difficultySelect.value() * 5 + 2] = gridSize;
        RECORDS[gamemodesSelect.value()][difficultySelect.value() * 5 + 3] = maxTime;
        RECORDS[gamemodesSelect.value()][difficultySelect.value() * 5 + 4] = preBoxes.length;
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
        endGameplay();
        return;
    }
    gameplay();
}

function mousePressed() {
    if (!startGame || !mouseCheck.checked()) {
        return;
    }
    gameplay();
}
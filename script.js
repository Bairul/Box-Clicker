const HEIGHT = 500;
const WIDTH = 600;
const MIN_PADDING = 8;
const DEFAULT_TIME = 30;
const DEFAULT_GRID_SIZE = 5;
// using a^x where a is 1.1, 1.25, 1.45, 1.52 for easy, normal, hard, nightmare respectively and x is time threshold
const DIFFICULTYS = [1.1, 1.2, 1.3, 1.25, 1.55, 2, 1.45, 2.1, 3, 1.52, 2.3, 3.5];
const RECORDS = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
                 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
                 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
                 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];

const SCOREBOARD_WIDTH = 100;
const SCOREBOARD_X = WIDTH - SCOREBOARD_WIDTH / 2;
const SCOREBOARD_TEXTSIZE = 20;
const HEALTHBAR_Y = 240;
const HEALTHBAR_SEG_LEN = 100;
const HEALTHBAR_SEG_WID = HEALTHBAR_SEG_LEN / 2;
const HEALTH_GAIN = HEALTHBAR_SEG_LEN / 3;
const MISS_COMBO = HEALTHBAR_SEG_LEN / 5;
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
let diffString = 'Normal';
let gmString = 'Classic'
let boxSize = HEIGHT / DEFAULT_GRID_SIZE;
let gridSize = DEFAULT_GRID_SIZE;
let maxTime = DEFAULT_TIME;
let time = DEFAULT_TIME;
let score = 0;
let combo = 0;
let maxCombo = 0;
let decayBar = 0;
let point = 0; // point earned per successful hit
let mixedRandMode = 1;
let preBoxesColorCycle = 0;
// objects
let currentBox;
let preBoxes = [];
let preBoxColors = ['red', 'blue', 'lime', 'yellow'];

// buttons
let startButton;
let restartButton;
let menuButton;
let backButton;
let recordsBackButton;
let historyButton;
let recordsButton;
let isInMenu = false;
let isInRecords = false;
// selects
let gamemodesSelect;
let difficultySelect;
// sliders
let gridSizeSlider;
let preBoxSlider;
let preBoxWeightSlider;
let timeSlider;
// checkboxes
let showLinesCheck;
let showTransCheck;
let mouseCheck;
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
    startButton = createButton('Start');
    restartButton = createButton('Restart');
    menuButton = createButton('Menu');
    backButton = createButton('Back');
    recordsButton = createButton('Records');
    recordsBackButton = createButton('Back');
    gamemodesSelect = createSelect();
    difficultySelect = createSelect();
    showLinesCheck = createCheckbox();
    showTransCheck = createCheckbox();
    mouseCheck = createCheckbox("", true);
    gridSizeSlider = createSlider(4, 8, gridSize, 1);
    preBoxSlider = createSlider(0, preBoxColors.length, 1, 1);
    preBoxWeightSlider = createSlider(4, 12, DEFAULT_WEIGHT, 2);
    timeSlider = createSlider(10, DEFAULT_TIME * 2, DEFAULT_TIME, 5);

    // set button size and position
    startButton.size(80, BUTTON_HEIGHT);
    restartButton.size(90, BUTTON_HEIGHT);
    menuButton.size(60, BUTTON_HEIGHT);
    backButton.size(60, BUTTON_HEIGHT);
    recordsBackButton.size(60, BUTTON_HEIGHT);
    recordsButton.size(80, BUTTON_HEIGHT);
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
    recordsButton.mouseClicked(openRecordMenu);
    recordsBackButton.mouseClicked(backGameRecords);

    // gamemodes radio
    gamemodesSelect.option('Classic', 0);
    gamemodesSelect.option('Streamy', 1);
    gamemodesSelect.option('Jumpy', 2);
    gamemodesSelect.option('Mixed', 3);
    gamemodesSelect.selected(0);
    // diffculty radio
    difficultySelect.option('Easy', 0);
    difficultySelect.option('Normal', 1);
    difficultySelect.option('Hard', 2);
    difficultySelect.option('Nightmare', 3);
    difficultySelect.selected(1);

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
    recordsBackButton.position(-WIDTH, -HEIGHT);
    // attribute('disabled', '');
    // removeAttribute('disabled');
}

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
    text(gmString, SCOREBOARD_X, SCOREBOARD_TEXTSIZE);
    text(diffString, SCOREBOARD_X, SCOREBOARD_TEXTSIZE * 2);
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
function updateRecordsPositions() {
    recordsBackButton.position(canvasPaddingX, canvasPaddingY);
}

function updateMenuPositions() {
    const vertPad = 28;
    const vertPadSlid = 60;
    const vomMenuX = canvasPaddingX + MENU_X;
    const vomMenuY = canvasPaddingY + 150;
    const vomSlidX =     MENU_X   + SLIDER_LENGTH * 2;
    const vomMenuSlidX = vomMenuX + SLIDER_LENGTH * 2;

    backButton.position(canvasPaddingX, canvasPaddingY);
    gamemodesSelect.position(vomMenuX, canvasPaddingY + 100);
    difficultySelect.position(vomMenuSlidX, canvasPaddingY + 100);
    gridSizeSlider.position(vomMenuX, vomMenuY);
    timeSlider.position(    vomMenuX, vomMenuY + vertPadSlid);
    mouseCheck.position(    vomMenuX + 80, vomMenuY + 109);
    preBoxSlider.position(  vomMenuSlidX, vomMenuY);
    showLinesCheck.position(vomMenuSlidX + 75, vomMenuY + 49);
    showTransCheck.position(vomMenuSlidX + 75, vomMenuY + 77);
    preBoxWeightSlider.position(vomMenuSlidX, vomMenuY + 195);

    textAlign(LEFT);
    textSize(SCOREBOARD_TEXTSIZE / 1.5);
    fill('black');
    strokeWeight(0.25);
    text("Size: " + gridSizeSlider.value(), MENU_X, MENU_Y);
    text("Time: " + timeSlider.value(),     MENU_X, MENU_Y + vertPadSlid);
    text("Mouse Click:", MENU_X, MENU_Y + vertPadSlid + vertPad);
    text("Premove: " + preBoxSlider.value(), vomSlidX, MENU_Y);
    text("Show Lines:",     vomSlidX, MENU_Y + vertPad);
    text("Transparent:",    vomSlidX, MENU_Y + vertPad * 2);
    text("Cursor:",         vomSlidX, MENU_Y + vertPad * 3);
    text("Premove Colors:", vomSlidX, MENU_Y + vertPad * 4);
    text("Weight: " + preBoxWeightSlider.value(), vomSlidX, MENU_Y + vertPad * 7);
    // colors
    cursorColorPick.position(vomMenuSlidX + 68, canvasPaddingY + 224 + vertPad);
    for (i = 0; i < preBoxColorPicks.length; i++) {
        preBoxColorPicks[i].position(vomMenuSlidX + i * 30, canvasPaddingY + 280 + vertPad);
        text(i + 1, vomSlidX + 8 + i * 30, MENU_Y + vertPad * 5)
    }
    textAlign(CENTER);
}

function hideMenuGui() {
    restartButton.position(-WIDTH, -HEIGHT);
    recordsButton.position(-WIDTH, -HEIGHT);
    backButton.position(-WIDTH, -HEIGHT);
    gridSizeSlider.position(-WIDTH, -HEIGHT);
    preBoxSlider.position(-WIDTH, -HEIGHT);
    preBoxWeightSlider.position(-WIDTH, -HEIGHT);
    timeSlider.position(-WIDTH, -HEIGHT);
    gamemodesSelect.position(-WIDTH, -HEIGHT);
    difficultySelect.position(-WIDTH, -HEIGHT);
    showLinesCheck.position(-WIDTH, -HEIGHT);
    showTransCheck.position(-WIDTH, -HEIGHT);
    mouseCheck.position(-WIDTH, -HEIGHT);
    cursorColorPick.position(-WIDTH, -HEIGHT);
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

// buttons
// when menu button is clicked
function menuChoose() {
    isInMenu = true;
    startButton.position(-WIDTH, -HEIGHT);
    restartButton.position(-WIDTH, -HEIGHT);
    menuButton.position(-WIDTH, -HEIGHT);
    recordsButton.position(-WIDTH, -HEIGHT);
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
    // strings
    if (gamemodesSelect.value() == 0) {
        gmString = 'Classic';
    } else if (gamemodesSelect.value() == 1) {
        gmString = 'Streamy';
    } else if (gamemodesSelect.value() == 2) {
        gmString = 'Jumpy';
    } else {
        gmString = 'Mixed';
    }

    if (difficultySelect.value() == 0) {
        diffString = 'Easy';
    } else if (difficultySelect.value() == 1) {
        diffString = 'Normal';
    } else if (difficultySelect.value() == 2) {
        diffString = 'Hard';
    } else {
        diffString = 'Nightmare';
    }
}
function backGameRecords() {
    isInRecords = false;
    recordsBackButton.position(-WIDTH, -HEIGHT);

    const tabrecord = document.getElementById("recordstab");
    tabrecord.style.top = -WIDTH;
    tabrecord.style.left = -HEIGHT;
    tabrecord.style.display = 'none';
    const tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
}

// allow dynamic canvas resizing
window.onresize = function() { 
    canvasPaddingX = max(MIN_PADDING, (window.innerWidth - WIDTH) / 2);
    canvasPaddingY = max(MIN_PADDING, (window.innerHeight - HEIGHT) / 2);
    canvas.position(canvasPaddingX, canvasPaddingY);
}

// record tabs
function openRecordMenu() {
    isInRecords = true;
    startButton.position(-WIDTH, -HEIGHT);
    restartButton.position(-WIDTH, -HEIGHT);
    menuButton.position(-WIDTH, -HEIGHT);
    recordsButton.position(-WIDTH, -HEIGHT);

    const tabrecord = document.getElementById("recordstab");
    tabrecord.style.display = 'block';
    tabrecord.style.top = canvasPaddingY;
    tabrecord.style.left = canvasPaddingX + 60;
    const tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.left = canvasPaddingX + 60;
        tabcontent[i].style.top = canvasPaddingY + 60;
    }
    // default tab open
    document.getElementById('defaultOpen').click();
}

function openRecord(evt, recordGamemode) {
    
    // Get all elements with class="tabcontent" and hide them
    const tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    const tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(recordGamemode).style.display = "block";
    evt.currentTarget.className += " active";

    let gm = 0;
    if (recordGamemode == 'streamy') {
        gm = 1;
    } else if (recordGamemode == 'jumpy') {
        gm = 2;
    } else if (recordGamemode == 'mixed') {
        gm = 3;
    }
    // Show records
    const diff = ['easy', 'normal', 'hard', 'nightmare'];
    for (i = 0; i < 4; i ++) {
        document.getElementById(recordGamemode + '_' + diff[i] + '_score').innerHTML = ('Highscore: ' + RECORDS[gm][i * 5]);
        document.getElementById(recordGamemode + '_' + diff[i] + '_combo').innerHTML = ('Combo: ' + RECORDS[gm][i * 5 + 1]);
        document.getElementById(recordGamemode + '_' + diff[i] + '_mod').innerHTML = ('Modifier: ' + RECORDS[gm][i * 5 + 2] 
                                                                                             + '-' + RECORDS[gm][i * 5 + 3] 
                                                                                             + '-' + RECORDS[gm][i * 5 + 4]);
    }
  }
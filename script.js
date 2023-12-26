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
let importRecordsButton;
let exportRecordsButton;
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
// modals
let exportModal = document.getElementById("exportPopup");

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
    importRecordsButton = createButton('Import');
    exportRecordsButton = createButton('Export');
    gamemodesSelect = createSelect();
    difficultySelect = createSelect();
    showLinesCheck = createCheckbox();
    showTransCheck = createCheckbox();
    mouseCheck = createCheckbox("", true);
    gridSizeSlider = createSlider(4, 8, gridSize, 1);
    preBoxSlider = createSlider(0, preBoxColors.length, 1, 1);
    preBoxWeightSlider = createSlider(4, 12, DEFAULT_WEIGHT, 2);
    timeSlider = createSlider(10, DEFAULT_TIME * 2, DEFAULT_TIME, 5);

    // set button size
    startButton.size(80, BUTTON_HEIGHT);
    restartButton.size(90, BUTTON_HEIGHT);
    menuButton.size(60, BUTTON_HEIGHT);
    backButton.size(60, BUTTON_HEIGHT);
    recordsBackButton.size(60, BUTTON_HEIGHT);
    recordsButton.size(80, BUTTON_HEIGHT);
    importRecordsButton.size(60, BUTTON_HEIGHT);
    exportRecordsButton.size(60, BUTTON_HEIGHT);

    gridSizeSlider.size(SLIDER_LENGTH);
    preBoxSlider.size(SLIDER_LENGTH);
    preBoxWeightSlider.size(SLIDER_LENGTH);
    timeSlider.size(SLIDER_LENGTH);

    // button functions
    restartButton.mouseClicked(initGame);
    startButton.mouseClicked(initGame);
    menuButton.mouseClicked(menuChoose);
    backButton.mouseClicked(backGame);
    recordsButton.mouseClicked(openRecordMenu);
    recordsBackButton.mouseClicked(backGameRecords);
    importRecordsButton.mouseClicked(importRecords);
    exportRecordsButton.mouseClicked(exportRecords);

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

    menuButton.position(canvasPaddingX, canvasPaddingY);
    // hide positions
    hideMenuGui();
    hideRecordsGui();
}


// buttons



// allow dynamic canvas resizing
window.onresize = function() { 
    canvasPaddingX = max(MIN_PADDING, (window.innerWidth - WIDTH) / 2);
    canvasPaddingY = max(MIN_PADDING, (window.innerHeight - HEIGHT) / 2);
    canvas.position(canvasPaddingX, canvasPaddingY);
}
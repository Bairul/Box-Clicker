// when menu button is clicked
function menuChoose() {
    isInMenu = true;
    startButton.position(-WIDTH, -HEIGHT);
    restartButton.position(-WIDTH, -HEIGHT);
    menuButton.position(-WIDTH, -HEIGHT);
    recordsButton.position(-WIDTH, -HEIGHT);
    updateMenuPositions();
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
    text("Show Fade:",    vomSlidX, MENU_Y + vertPad * 2);
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
    // there is at least 1 prebox
    preBoxes.push(new PRE_BOX(0, 0, preBoxColors[0]));
    for (i = 1; i < preBoxSlider.value(); i++) {
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
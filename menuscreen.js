MENU_PARAMS ={
    SLIDER_LENGTH: 100,
    X: 150,
    Y: 170,
}

class Menu {
    constructor(game) {
        this.game = game;
        this.firstTime = true;
        this.startButton = document.getElementById("startButton");
        this.menuButton = document.getElementById("menuButton");
        this.backButton = document.getElementById("backButton");
        this.gamemodesTooltip = document.getElementById("gamemodesTooltip");
        this.gamemodeSelect = document.getElementById("gamemodeSelect");
        this.difficultyTooltip = document.getElementById("difficultyTooltip");
        this.difficultySelect = document.getElementById("difficultySelect");
        this.gridSlider = document.getElementById("gridSlider");
        this.premoveSlider = document.getElementById("premoveSlider");
        this.linesCheckbox = document.getElementById("linesCheckbox");
        this.fadeCheckbox = document.getElementById("fadeCheckbox");
        this.mouseCheckbox = document.getElementById("mouseCheckbox");

        this.hideMenuOptions();
        this.menubuttons();
    }

    getDifficulty() {
        return this.difficultySelect.value;
    }

    getGamemode() {
        return this.gamemodeSelect.value;
    }

    getGridsize() {
        return this.gridSlider.value;
    }

    getPremoves() {
        return this.premoveSlider.value;
    }

    getMouseClick() {
        return this.mouseCheckbox.checked;
    }

    getShowLines() {
        return this.linesCheckbox.checked;
    }

    getShowFade() {
        return this.fadeCheckbox.checked;
    }

    menubuttons() {
        let that = this;
        this.startButton.onclick = function () {
            PARAMS.START = true;
            document.getElementById("gameWorld").focus();
            hideElement("startButton");
            hideElement("menuButton");
        }
        this.menuButton.onclick = function () {
            PARAMS.MENU = true;
            document.getElementById("gameWorld").focus();
            hideElement("menuButton");
            hideElement("startButton");
            that.showMenuOptions();
        }
        this.backButton.onclick = function () {
            PARAMS.MENU = false;
            document.getElementById("gameWorld").focus();
            that.hideMenuOptions();
            showElement("menuButton");
            showElement("startButton");
        }
    }

    hideMenuOptions() {
        hideElement("backButton");
        hideElement("gamemodeSelect");
        hideElement("gridSlider");
        hideElement("difficultySelect");
        hideElement("premoveSlider");
        hideElement("linesCheckbox");
        hideElement("mouseCheckbox");
        hideElement("fadeCheckbox");
        hideElement("gamemodesTooltip");
        hideElement("difficultyTooltip");
    }

    showMenuOptions() {
        showElement("backButton");
        showElement("gamemodeSelect");
        showElement("gridSlider");
        showElement("difficultySelect");
        showElement("premoveSlider");
        showElement("linesCheckbox");
        showElement("mouseCheckbox");
        showElement("fadeCheckbox");
        showElement("gamemodesTooltip");
        showElement("difficultyTooltip");
    }

    restart() {
        showElement("startButton");
        showElement("menuButton");
    }

    update() {
        this.menuButton.style.left = PARAMS.canvasPaddingX + "px";
        this.menuButton.style.top = PARAMS.canvasPaddingY + "px";
        this.backButton.style.left = PARAMS.canvasPaddingX + "px";
        this.backButton.style.top = PARAMS.canvasPaddingY + "px";

        const vomMenuX = PARAMS.canvasPaddingX + MENU_PARAMS.X;
        const vomMenuY = PARAMS.canvasPaddingY + MENU_PARAMS.Y;
        const vomMenuSlidX = vomMenuX + 100 * 2;

        this.gamemodesTooltip.style.left = vomMenuX + "px";
        this.gamemodesTooltip.style.top = PARAMS.canvasPaddingY + MENU_PARAMS.SLIDER_LENGTH + "px";
        this.gamemodeSelect.style.left = vomMenuX + "px";
        this.gamemodeSelect.style.top = PARAMS.canvasPaddingY + MENU_PARAMS.SLIDER_LENGTH + 20 + "px";

        this.difficultyTooltip.style.left = vomMenuSlidX + 5 + "px";
        this.difficultyTooltip.style.top = PARAMS.canvasPaddingY + MENU_PARAMS.SLIDER_LENGTH + "px";
        this.difficultySelect.style.left = vomMenuSlidX + "px";
        this.difficultySelect.style.top = PARAMS.canvasPaddingY + MENU_PARAMS.SLIDER_LENGTH + 20 + "px";

        this.gridSlider.style.left = vomMenuX + "px";
        this.gridSlider.style.top = vomMenuY + "px";

        this.premoveSlider.style.left = vomMenuSlidX + "px";
        this.premoveSlider.style.top = vomMenuY + "px";

        this.mouseCheckbox.style.left = vomMenuX + 80 + "px";
        this.mouseCheckbox.style.top = vomMenuY + 49 + "px";

        this.linesCheckbox.style.left = vomMenuSlidX + 75 + "px";
        this.linesCheckbox.style.top = vomMenuY + 49 + "px";

        this.fadeCheckbox.style.left = vomMenuSlidX + 75 + "px";
        this.fadeCheckbox.style.top = vomMenuY + 77 + "px";

        if (this.firstTime) {
            this.startButton.style.left = PARAMS.canvasPaddingX + PARAMS.WIDTH / 2 - 40 + "px";
            this.startButton.style.top = PARAMS.canvasPaddingY + PARAMS.HEIGHT / 2 - 15 / 2 + "px";
        } else {
            this.startButton.style.left = PARAMS.canvasPaddingX + PARAMS.WIDTH / 2 - 90 + "px";
            this.startButton.style.top = PARAMS.canvasPaddingY + PARAMS.HEIGHT / 2 - 15 / 2 + "px";
        }
    }

    draw(ctx) {
        if (PARAMS.MENU) {
            const SP = 16;
            const offsetY = 32;
            const vertPad = 28;
            const vertPadSlid = 60;
            const vomSlidX = MENU_PARAMS.X + MENU_PARAMS.SLIDER_LENGTH * 2;
            textSize(ctx, 12);
            fill(ctx, "black");

            rect(ctx, MENU_PARAMS.X, MENU_PARAMS.Y + SP * 11, 300, 85, rgb(230, 230, 230), "black");
            text(ctx, "Instructions:", MENU_PARAMS.X + 2, MENU_PARAMS.Y + SP * 12);
            text(ctx, "Click on black box using mouse click or any key press. ", MENU_PARAMS.X + 2, MENU_PARAMS.Y + SP * 13);
            text(ctx, "Your score depends on combo and health.", MENU_PARAMS.X + 2, MENU_PARAMS.Y + SP * 14);
            text(ctx, "Red square shows where the black box will be at next.", MENU_PARAMS.X + 2, MENU_PARAMS.Y + SP * 15);
            text(ctx, "Press Escape to quit current game.", MENU_PARAMS.X + 2, MENU_PARAMS.Y + SP * 16);

            text(ctx, "Size: " + this.gridSlider.value, MENU_PARAMS.X, MENU_PARAMS.Y + offsetY);
            text(ctx, "Mouse Click:", MENU_PARAMS.X, MENU_PARAMS.Y + offsetY + vertPad);
            text(ctx, "Premove: " + this.premoveSlider.value, vomSlidX, MENU_PARAMS.Y + offsetY);
            text(ctx, "Show Lines:", vomSlidX, MENU_PARAMS.Y + offsetY + vertPad);
            text(ctx, "Show Fade:", vomSlidX, MENU_PARAMS.Y + offsetY + vertPad * 2);
        }
    }
}

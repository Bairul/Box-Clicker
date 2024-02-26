class Menu {
    constructor(game) {
        this.game = game;
        this.firstTime = true;
        this.startButton = document.getElementById("startButton");
        this.menuButton = document.getElementById("menuButton");
        this.backButton = document.getElementById("backButton");
        this.gamemodeSelect = document.getElementById("gamemodeSelect");
        this.difficultySelect = document.getElementById("difficultySelect");
        this.gridSlider = document.getElementById("gridSlider");

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
    }

    showMenuOptions() {
        showElement("backButton");
        showElement("gamemodeSelect");
        showElement("gridSlider");
        showElement("difficultySelect");
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

        const MENU_X = 150;
        const vomMenuX = PARAMS.canvasPaddingX + MENU_X;
        const vomMenuY = PARAMS.canvasPaddingY + MENU_X;
        const vomMenuSlidX = vomMenuX + 100 * 2;

        this.gamemodeSelect.style.left = vomMenuX + "px";
        this.gamemodeSelect.style.top = PARAMS.canvasPaddingY + 100 + "px";
        this.difficultySelect.style.left = vomMenuSlidX + "px";
        this.difficultySelect.style.top = PARAMS.canvasPaddingY + 100 + "px";
        this.gridSlider.style.left = vomMenuX + "px";
        this.gridSlider.style.top = vomMenuY + "px";

        if (this.firstTime) {
            this.startButton.style.left = PARAMS.canvasPaddingX + PARAMS.WIDTH / 2 - 40 + "px";
            this.startButton.style.top = PARAMS.canvasPaddingY + PARAMS.HEIGHT / 2 - 15 / 2 + "px";
        } else {
            this.startButton.style.left = PARAMS.canvasPaddingX + PARAMS.WIDTH / 2 - 90 + "px";
            this.startButton.style.top = PARAMS.canvasPaddingY + PARAMS.HEIGHT / 2 - 15 / 2 + "px";
        }

    }

    draw(ctx) {
        
    }
}

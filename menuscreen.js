class Menu {
    constructor(game) {
        this.game = game;
        this.firstTime = true;
        this.startButton = document.getElementById("startButton");
        this.menuButton = document.getElementById("menuButton");
        this.backButton = document.getElementById("backButton");
        this.gamemodeSelect = document.getElementById("gamemodeSelect");
        this.gridSlider = document.getElementById("gridSlider");

        this.hideMenuOptions();
        this.menubuttons();
    }

    menubuttons() {
        let that = this;
        this.startButton.onclick = function() {
            PARAMS.START = true;
            document.getElementById("gameWorld").focus();
            hideElement("startButton");
            hideElement("menuButton");
        }
        this.menuButton.onclick = function() {
            PARAMS.MENU = true;
            document.getElementById("gameWorld").focus();
            hideElement("menuButton");
            hideElement("startButton");
            that.showMenuOptions();
        }
        this.backButton.onclick = function() {
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
    }

    showMenuOptions() {
        showElement("backButton");
        showElement("gamemodeSelect");
        showElement("gridSlider");
    }

    restart() {
        showElement("startButton");
        showElement("menuButton");
    }

    update() {

    }

    draw(ctx) {
        
    }
}

class Menu {
    constructor(game) {
        this.game = game;
        this.firstTime = true;
        this.startButton = document.getElementById("startButton");
        this.restartButton = document.getElementById("restartButton");
        hideElement("restartButton");

        this.menubuttons();
    }

    menubuttons() {
        this.startButton.onclick = function() {
            PARAMS.START = true;
            document.getElementById("gameWorld").focus();
            hideElement("startButton");
        }
        this.restartButton.onclick = function() {
            PARAMS.START = true;
            document.getElementById("gameWorld").focus();
            hideElement("restartButton");
        }
    }

    restart() {
        showElement("restartButton");
    }

    update() {

    }

    draw(ctx) {
        
    }
}

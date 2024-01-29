class Menu {
    constructor(game) {
        this.game = game;
        this.startGame = false;
        this.startButton = document.getElementById("startButton");

        this.menubuttons();
    }

    menubuttons() {
        this.startButton.onclick = function() {
            PARAMS.START = true;
            document.getElementById("gameWorld").focus();
            hideElement("startButton");
        }
    }

    update() {
        
    }

    draw(ctx) {
        
    }
}

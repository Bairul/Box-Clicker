const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	PARAMS.canvasPaddingX = Math.max(8, (window.innerWidth - PARAMS.WIDTH) / 2);
    PARAMS.canvasPaddingY = Math.max(8, (window.innerHeight - PARAMS.HEIGHT) / 2);
    canvas.style.position = 'absolute';
    canvas.style.top = PARAMS.canvasPaddingY + "px";
    canvas.style.left = PARAMS.canvasPaddingX + "px";

	gameEngine.init(ctx);

	new SceneManager(gameEngine);

	gameEngine.start();
});

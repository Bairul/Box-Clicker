const canvas = document.getElementById("gameWorld");
// allow dynamic canvas resizing
window.onresize = function() { 
    PARAMS.canvasPaddingX = Math.max(8, (window.innerWidth - PARAMS.WIDTH) / 2);
    PARAMS.canvasPaddingY = Math.max(8, (window.innerHeight - PARAMS.HEIGHT) / 2);
    canvas.style.position = 'absolute';
    canvas.style.top = PARAMS.canvasPaddingY + "px";
    canvas.style.left = PARAMS.canvasPaddingX + "px";
}
function line(ctx, x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}


function stroke(ctx, r, g, b, a) {
    if (a) {
        ctx.strokeStyle = rgba(r, g, b, a);
    } else if (g) {
        ctx.strokeStyle = rgb(r, g, b);
    } else {
        ctx.strokeStyle = r;
    }
}

function fill(ctx, r, g, b, a) {
    if (a) {
        ctx.fillStyle = rgba(r, g, b, a);
    } else if (g) {
        ctx.fillStyle = rgb(r, g, b);
    } else {
        ctx.fillStyle = r;
    }
}

function text(ctx, text, x, y) {
    ctx.fillText(text, x, y);
}

function strokeWeight(ctx, weight) {
    ctx.lineWidth = weight;
}

function centerRect(ctx, x, y, w, h, fill, border) {
    if (border) {
        ctx.fillStyle = fill;
        ctx.fillRect(x - w / 2, y - h / 2, w, h);
        ctx.fillStyle = border;
        ctx.strokeRect(x - w / 2, y - h / 2, w, h);
    } else {
        if (fill) {
            ctx.fillStyle = fill;
            ctx.fillRect(x - w / 2, y - h / 2, w, h);
        }
        else ctx.strokeRect(x - w / 2, y - h / 2, w, h);
    }
}

function rect(ctx, x, y, w, h, fill, border) {
    if (border) {
        ctx.fillStyle = fill;
        ctx.fillRect(x, y, w, h);
        ctx.fillStyle = border;
        ctx.strokeRect(x, y, w, h);
    } else {
        if (fill) {
            ctx.fillStyle = fill;
            ctx.fillRect(x, y, w, h);
        }
        else ctx.strokeRect(x, y, w, h);
    }
}

function textSize(ctx, size) {
    ctx.font = size + 'px ' + PARAMS.FONT;
}
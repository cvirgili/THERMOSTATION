function TempDiagram() {
    var canvas, ctx;
    canvas = document.getElementById("clock");
    ctx = canvas.getContext("2d");
    x = 0;
    c = 0;
    ctx.strokeStyle = "#bdecff";
    ctx.moveTo(0, this.h);
    ctx.beginPath();
    ctx.lineWidth = 1;

    function startDraw() {
        if (x > canvas.width) {
            ctx.closePath();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            ctx.moveTo(0, canvas.height - Math.random() * 30 - 10);
            x = 0;
        } else {
            x += 10;
            ctx.lineTo(x, canvas.height - Math.random() * 30 - 10);
            ctx.stroke();
        }
        setTimeout(startDraw, 1000);
    }
    startDraw();
}
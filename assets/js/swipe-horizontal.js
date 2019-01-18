function SwipeHorizontal(container, itemclass) {

    var cX = 0;
    var index = 0;
    var actualLeft = 0;
    var divs = $('.' + itemclass);
    var treshold = window.innerWidth * 0.5;
    var animated = false;

    $('#' + container).css({ 'width': 100 * divs.length + 'vw' });

    document.addEventListener("touchstart", function(event) {
        cX = event.touches[0].clientX;
        actualLeft = $('#' + container).position().left;
    });

    document.addEventListener("touchmove", function(event) {
        if (animated == true) return;
        var x = event.changedTouches[0].clientX;
        var d = x - cX;
        var dabs = Math.abs(x - cX);
        if (dabs > treshold / 2) { move(actualLeft + (d > 0 ? 20 : -20)); }
        if (dabs > treshold) {
            animated = true;
            index += d > 0 ? -1 : 1;
            if (index > divs.length - 1) index = divs.length - 1;
            if (index < 0) index = 0;
            move(-$(divs[index]).position().left);
        }
    });

    document.addEventListener("touchend", function(event) {
        var x = event.changedTouches[0].clientX;
        animated = false;
        if (x == cX) return;
        if (Math.abs(x - cX) < treshold) { move(actualLeft); }
    });

    window.addEventListener('resize', function(e) {
        move(-$(divs[index]).position().left);
    });

    function move(n) {
        $('#' + container).css({ 'left': n });
    }
}
/**************************************************
 ** FOOD CLASS
 **************************************************/
var Food = function(startX, startY) {
    var x = startX,
        y = startY,
        id,
        planetImage = new Image();

    planetImage.src = "../assets/star3.png";

    var getX = function() {
        return x;
    };

    var getY = function() {
        return y;
    };

    var setX = function(newX) {
        x = newX;
    };

    var setY = function(newY) {
        y = newY;
    };

    var update = function(keys) {
        /*var prevX = x,
            prevY = y;

        // Up key takes priority over down
        if (keys.up) {
            y -= moveAmount;
        } else if (keys.down) {
            y += moveAmount;
        };

        // Left key takes priority over right
        if (keys.left) {
            x -= moveAmount;
        } else if (keys.right) {
            x += moveAmount;
        };

        return (prevX != x || prevY != y) ? true : false;*/
    };

    var draw = function(ctx) {
        ctx.fillStyle="#FF0000";
        //ctx.fillRect(x-20, y-20, 10, 10);
        ctx.drawImage(planetImage, x-22, y-22);
    };

    return {
        getX: getX,
        getY: getY,
        setX: setX,
        setY: setY,

        update: update,
        draw: draw
    }
};
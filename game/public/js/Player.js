/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(startX, startY, pointsgiven) {
	var x = startX,
		y = startY,
        id,
		moveAmount = 2,
        points = pointsgiven;


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

    var getPoints = function(){
        return points;
    };

    var setPoints = function(newPoint) {
        points = newPoint;
    };


	var update = function(keys) {
        var prevX = x,
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

        return (prevX != x || prevY != y) ? true : false;
	};

	var draw = function(ctx) {
<<<<<<< HEAD
        ctx.fillStyle = "#22a0de";
        ctx.fillRect(x-5, y-5, 20, 20);

};
=======
        //console.log("points: " + points);
        ctx.fillStyle="#FF0000";
        ctx.fillRect(x-5, y-5, 20, 20);

	};
>>>>>>> FETCH_HEAD

	return {
        getX: getX,
        getY: getY,
        setX: setX,
        setY: setY,
        getPoints: getPoints,
        setPoints: setPoints,

		update: update,
		draw: draw
	}
};
/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(startX, startY, pointsgiven) {
	var x = startX,
		y = startY,
        id,
		moveAmount = 3,
        points = pointsgiven,
        monsterImage = new Image();

    monsterImage.src = "../assets/monster_groen.png";

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

        //console.log("x: "+ x + " y: " + y);
        if((x < 5) || (x > 485) || (y < 5) || (y > 485)){
            x = prevX;
            y = prevY;
            return false;
        }
        return (prevX != x || prevY != y) ? true : false;
	};

	var draw = function(ctx) {
        ctx.fillStyle = "#22a0de";
        //ctx.fillRect(x-5, y-5, 20, 20);
        ctx.drawImage(monsterImage, x-5, y-5);
};


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
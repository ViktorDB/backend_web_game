/**
 * Created by Viktor on 29/11/14.
 */

var Player = function(startX, startY, pointsgiven) {
    var x = startX,
        y = startY,
<<<<<<< HEAD
        name,
        id;
=======
        id,
        points = pointsgiven;
>>>>>>> FETCH_HEAD

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

<<<<<<< HEAD

    //var players = [];
=======
    var getPoints = function(){
        return points;
    };

    var setPoints = function(newPoints) {
        points = newPoints;
    };
>>>>>>> FETCH_HEAD

    return {
        getX: getX,
        getY: getY,
        setX: setX,
        setY: setY,
<<<<<<< HEAD
        id: id,
        name: name

        //players: players
=======
        getPoints: getPoints,
        setPoints: setPoints,

        id: id
>>>>>>> FETCH_HEAD
    }
};

Player.prototype.players = [];

exports.Player = Player;
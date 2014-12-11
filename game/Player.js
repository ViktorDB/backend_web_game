/**
 * Created by Viktor on 29/11/14.
 */

var Player = function(startX, startY, pointsgiven) {
    var x = startX,
        y = startY,
        name,
        id,
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


    //var players = [];
    var getPoints = function(){
        return points;
    };

    var setPoints = function(newPoints) {
        points = newPoints;
    };

    return {
        getX: getX,
        getY: getY,
        setX: setX,
        setY: setY,
        id: id,
        name: name,

        //players: players

        getPoints: getPoints,
        setPoints: setPoints,

        id: id

    }
};

Player.prototype.players = [];

exports.Player = Player;
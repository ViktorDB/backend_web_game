/**
 * Created by Viktor on 29/11/14.
 */

var Player = function(startX, startY, pointsgiven) {
    var x = startX,
        y = startY,
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
        getPoints: getPoints,
        setPoints: setPoints,

        id: id
    }
};

exports.Player = Player;
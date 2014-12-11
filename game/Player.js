/**
 * Created by Viktor on 29/11/14.
 */

var Player = function(startX, startY) {
    var x = startX,
        y = startY,
        name,
        id;

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

    return {
        getX: getX,
        getY: getY,
        setX: setX,
        setY: setY,
        id: id,
        name: name

        //players: players
    }
};

Player.prototype.players = [];

exports.Player = Player;
/**
 * Created by nielslammens on 4/12/14.
 */


var Food = function(startX, startY) {
    var x = startX,
        y = startY,
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

    return {
        getX: getX,
        getY: getY,
        setX: setX,
        setY: setY,
        id: id
    }
};

exports.Food = Food;
/**************************************************
** NODE.JS REQUIREMENTS
**************************************************/
var util = require("util"),					// Utility resources (logging, object inspection, etc)
	io = require("socket.io");				// Socket.IO
	Player = require("./Player").Player;	// Player class
    Food = require("./Food").Food;          // Food class


/**************************************************
** GAME VARIABLES
**************************************************/
var socket,		// Socket controller
	players,	// Array of connected players
    foodsArr;      // Array of foods


/**************************************************
** GAME INITIALISATION
**************************************************/
function init() {
	// Create an empty array to store players
	players = [];

    foods = [];

	socket = io.listen(8000);

	socket.configure(function()
	{
    	socket.set("transports", ["websocket"]);
    	socket.set("log level", 2);
	});

	setEventHandlers();

    generateFood();



};

function generateFood()
{
    var id = 0
    socket.sockets.on("connection", function (socket) {

        setInterval(function () {

            if(foods.length <= 1)
            {

                var startX = Math.round(Math.random()*(500-40)) + 20;
                startX = startX + "";
                var startY = Math.round(Math.random()*(500-40)) + 20;
                startY = startY + "";

                util.log("x:" + startX + "y:" + startY);

                id++;

                var newFood = {id: id , x: startX, y: startY};
                foods.push(newFood);

                socket.emit("getFood", foods);
                util.log("food added to array and send to game");

            }
            
        }, 10);

    });
}



var setEventHandlers = function() {
    socket.sockets.on("connection", onSocketConnection);
};

function onSocketConnection(client) {
    util.log("New player has connected: "+client.id);
    client.on("disconnect", onClientDisconnect);
    client.on("new player", onNewPlayer);
    client.on("move player", onMovePlayer);
};

function onClientDisconnect() {
    util.log("Player has disconnected: "+this.id);

    var removePlayer = playerById(this.id);

    if (!removePlayer) {
        util.log("Player not found: "+this.id);
        return;
    };

    players.splice(players.indexOf(removePlayer), 1);
    this.broadcast.emit("remove player", {id: this.id});

};

function onNewPlayer(data) {

    var newPlayer = new Player(data.x, data.y);
    newPlayer.id = this.id;

    this.broadcast.emit("new player", {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY()});

    var i, existingPlayer;
    for (i = 0; i < players.length; i++) {
        existingPlayer = players[i];
        this.emit("new player", {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY()});
    };

    players.push(newPlayer);

};


function onMovePlayer(data) {

    var movePlayer = playerById(this.id);

    if (!movePlayer) {
        util.log("Player not found: "+this.id);
        return;
    };

    movePlayer.setX(data.x);
    movePlayer.setY(data.y);

    this.broadcast.emit("move player", {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY()});

    checkForFoodAndPlayerCollision(movePlayer);

};

function checkForFoodAndPlayerCollision(currentPlayer)
{

    var pX = currentPlayer.getX(), pY = currentPlayer.getY();

    if(foods.length > 0)
    {
        for (var i = 0; i <= foods.length-1; i++)
        {
            //util.log(foods);
            var foodx = (foods[i].x);
            var foody = (foods[i].y);

            var dist = calcDistance(foodx, foody, pX, pY);

            util.log("food: ("+ foodx + ";"+ foody + ") player: (" + pX+";"+ pY+") distance: " + dist.x + ":" + dist.y);

            if((dist.x < 15) && (dist.x > -15) && (dist.y < 15) && (dist.y > -15))
            {
                util.log("FOOD AND PLAYER COLLISION");
                util.log(foods);
                foods.splice(i, 1);
                util.log(foods);
            }
        }
    }
}

function calcDistance(foodX, foodY, playerX, playerY)
{
    var xs = 0;
    var ys = 0;

    var foodSize = 10, playerSize = 20,

    xs = foodX - playerX - playerSize;

    ys = foodY - playerY - playerSize;

    var dist = {x: xs, y: ys};

    return dist;
}


function playerById(id) {
    var i;
    for (i = 0; i < players.length; ++i) {
        if (players[i].id == id)
            return players[i];
    };

    return false;
};



/**************************************************
** RUN THE GAME
**************************************************/
init();
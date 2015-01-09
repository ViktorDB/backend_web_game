/**************************************************
** NODE.JS REQUIREMENTS
**************************************************/
var util = require("util"),					// Utility resources (logging, object inspection, etc)
	io = require("socket.io");				// Socket.IO
	Player = require("./Player").Player;	// Player class
    Food = require("./Food").Food;          // Food class
var global = require('./global.js');


/**************************************************
** GAME VARIABLES
**************************************************/
var socket,		// Socket controller
	players,	// Array of connected players
    foodsArr,      // Array of foods
    gameTimer,
    winnerLastRoundName,
    winnerLastRoundPlayer,
    firstConnection,
    winnerName,
    secondWinnerName,
    usernamesInGame;


/**************************************************
** GAME INITIALISATION
**************************************************/
function init() {
	// Create an empty array to store players
	players = [];

    foods = [];
    usernamesInGame = [];
    gameTimer = 121000;
    firstConnection = false;
    winnerName = "";
    secondWinnerName = "";



	//socket = io.listen(8000);

	global.socket.configure(function()
	{
        global.socket.set("transports", ["websocket"]);
    	global.socket.set("log level", 2);
	});

	setEventHandlers();

    generateFood();


    checkPreviousWinner();

};

function generateFood()
{
    var id = 0;
    var timerStartTime = 121000;

    timerControl();

    global.socket.sockets.on("connection", function (socket) {

        //DE INTERVAL!!!
        var miliSeconds = 10;
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


                util.log("food added to array and send to game");

            }
            else
            {
                socket.emit("getFood", foods);
            }

            if(usernamesInGame.length > 0)
            {
                socket.emit("getPlayerList", usernamesInGame);
                //util.log("POINTS SERVER : " + usernamesInGame[0].points);
            }

            if(gameTimer > 0 )
            {
                socket.emit("updateTimer", gameTimer);
            }else if(gameTimer == 0 && winnerName != ""){
                socket.emit("lastRoundWinner", winnerName);
                util.log("emit winner wordt verzonden");


                setTimeout(function(){

                    for(var p = 0; p < usernamesInGame.length; p++)
                    {
                        usernamesInGame[p].points = 0;
                    }

                    gameTimer = timerStartTime;
                    winnerName = "";


                }, 500);



            }

        }, miliSeconds);



    });


}

function timerControl(){

    var timerStartTime = 121000;

    var miliSeconds = 10;


    setInterval(function () {
        if(gameTimer > 0)
        {
            gameTimer = gameTimer - miliSeconds;
        }
        else if(gameTimer == 0 && winnerName == "")
        {
            for(var p = 0; p < usernamesInGame.length; p++)
            {
                if( p == 0)
                {
                    winnerLastRoundPlayer = usernamesInGame[p];
                    util.log("first player loop");
                }

                util.log("NAAM: " + usernamesInGame[p].name + usernamesInGame[p].points);


                if( winnerLastRoundPlayer.points < usernamesInGame[p].points )
                {
                    winnerLastRoundPlayer = usernamesInGame[p];
                    util.log("player winner changed");
                }

                usernamesInGame[p].points = 0;

                winnerName = winnerLastRoundPlayer.name;
                util.log("winner naam wordt in var gestoken");

                util.log("WINNER" + winnerLastRoundPlayer.name);
            }

        }
    }, miliSeconds);



}


function checkPreviousWinner()
{
    var test = 'test';
    global.socket.sockets.on("connection", function (socket) {
        socket.emit('news', test);
    });
}



var setEventHandlers = function() {
    global.socket.sockets.on("connection", onSocketConnection);
};

function onSocketConnection(client) {

    util.log("New player has connected: "+client.id);
    client.on("disconnect", onClientDisconnect);
    client.on("new player", onNewPlayer);
    client.on("move player", onMovePlayer);
    client.on("message from client", onMessageFromClient);
};

function onClientDisconnect() {
    util.log("Player has disconnected: "+this.id);

    var removePlayer = playerById(this.id);

    if (!removePlayer) {
        util.log("Player not found: "+this.id);
        return;
    };

    players.splice(players.indexOf(removePlayer), 1);
    usernamesInGame.splice(usernamesInGame.indexOf(removePlayer), 1);
    this.broadcast.emit("remove player", {id: this.id});

};

function onNewPlayer(data) {

    util.log(data.name);
    var newPlayer = new Player(data.x, data.y, data.points);
    newPlayer.points = data.points;
    newPlayer.name = data.name;
    newPlayer.id = this.id;

    this.broadcast.emit("new player", {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY(), points: newPlayer.getPoints(), name: newPlayer.name});

    var i, existingPlayer;
    for (i = 0; i < players.length; i++) {
        existingPlayer = players[i];
        this.emit("new player", {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY(), points:existingPlayer.getPoints(), name: newPlayer.name});
    };

    players.push(newPlayer);
    usernamesInGame.push(newPlayer);



};


function onMovePlayer(data) {

    var movePlayer = playerById(this.id);

    if (!movePlayer) {
        util.log("Player not found: "+this.id);
        return;
    };

    movePlayer.setX(data.x);
    movePlayer.setY(data.y);

    checkForFoodAndPlayerCollision(movePlayer);

    var pX = movePlayer.getX(), pY = movePlayer.getY();

    if((pX < 0) || (pX > 500) || (pY < 0) || (pY > 500))
    {
        util.log("BORDER COLLISION");
    }else{
        this.broadcast.emit("move player", {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY(), points: movePlayer.getPoints()});
    }



    checkForPlayersCollision(movePlayer);
    checkForBorderCollision(movePlayer);

};

function checkForPlayersCollision(currentPlayer){
    var pX = currentPlayer.getX(), pY = currentPlayer.getY();

    pX += 10;
    pY += 10

    for(var i = 0; i < players.length - 1; i++){
        if(players[i].id != currentPlayer.id){

            //util.log("other: "+players[i].id + "; current:" + currentPlayer.id);

            var otherX = players[i].getX();
            var otherY = players[i].getY();

            otherX += 10;
            otherY += 10;

            //util.log("other: ("+ otherX + ";"+ otherY + ") player: (" + pX+";"+ pY+")");


            var dist = calcDistancePlayers(otherX, otherY, pX, pY);
            util.log("other: ("+ otherX + ";"+ otherY + ") player: (" + pX+";"+ pY+") distance: " + dist.x + ":" + dist.y);

            if((dist.x < 20) && (dist.x > -20) && (dist.y < 20) && (dist.y > -20))
            {
                util.log("OTHER AND PLAYER COLLISION");
            }
        }
    }
}

function checkForFoodAndPlayerCollision(currentPlayer)
{

    var pX = currentPlayer.getX(), pY = currentPlayer.getY();

    var points = 0;

    if(foods.length > 0)
    {
        for (var i = 0; i <= foods.length-1; i++)
        {
            //util.log(foods);
            var foodx = (foods[i].x);
            var foody = (foods[i].y);

            var dist = calcDistance(foodx, foody, pX, pY);

            //util.log("food: ("+ foodx + ";"+ foody + ") player: (" + pX+";"+ pY+") distance: " + dist.x + ":" + dist.y);

            if((dist.x < 15) && (dist.x > -15) && (dist.y < 15) && (dist.y > -15))
            {
                util.log("FOOD AND PLAYER COLLISION");
                //util.log(foods);
                foods.splice(i, 1);
                //util.log(foods);
                currentPlayer.setPoints(currentPlayer.getPoints() + 1);


                //ARRAY VAN SPELERS AANPASSEN (PUNTJE BIJTELLEN)
                for(var i = 0; i < usernamesInGame.length; i++)
                {
                    if(currentPlayer.id == usernamesInGame[i].id)
                    {
                        //util.log("POINTS1 " + usernamesInGame[i].getPoints());
                        usernamesInGame[i].points = usernamesInGame[i].points + 1;
                        //util.log("POINTS " + usernamesInGame[i].getPoints());
                        //util.log("POINTS GAINED");
                    }
                }
                //usernamesInGame.splice(usernamesInGame.indexOf(removePlayer), 1);

            };
        }
    }
}

function checkForBorderCollision(currentPlayer)
{

    var pX = currentPlayer.getX(), pY = currentPlayer.getY();

    util.log("x: " + pX + " y:" + pY);

    if((pX < 0) || (pX > 500) || (pY < 0) || (pY > 500))
    {
       util.log("BORDER COLLISION");
    }
}

function calcDistancePlayers(p1X, p1Y, p2X, p2Y){

    var xs = 0, ys = 0;
    xs = p1X - p2X;
    ys = p1Y - p2Y;

    var dist = {x: xs, y: ys};
    return dist;
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
 ** CHATBOX
 **************************************************/
function onMessageFromClient(data){
    this.broadcast.emit("message from server",{user: data.user, text: data.text});
}




/**************************************************
** RUN THE GAME
**************************************************/
init();
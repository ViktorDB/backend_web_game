/**************************************************
** GAME VARIABLES
**************************************************/
var canvas,			// Canvas DOM element
	ctx,			// Canvas rendering context
	keys,			// Keyboard input
	localPlayer,	// Local player
    remotePlayers,
    socket,
    foodsArray,
    localFood;




/**************************************************
** GAME INITIALISATION
**************************************************/
function init() {
	// Declare the canvas and rendering context
	canvas = document.getElementById("gameCanvas");
	ctx = canvas.getContext("2d");

	// Maximise the canvas
	canvas.width = 500;
	canvas.height = 500;

	// Initialise keyboard controls
	keys = new Keys();

	// Calculate a random start position for the local player
	// The minus 5 (half a player size) stops the player being
	// placed right on the egde of the screen
    var startX = Math.round(Math.random()*(canvas.width-5)),
        startY = Math.round(Math.random()*(canvas.height-5));

    foodsArray = [];

	// Initialise the local player


    socket = io.connect("http://172.30.13.29", {port: 8000, transports: ["websocket"]});
	localPlayer = new Player(startX, startY, 0);

    var element = document.getElementById("session-username");
    var sessionusername = element.innerHTML;
    localPlayer.name = sessionusername;



    remotePlayers = [];


	// Start listening for events
	setEventHandlers();


};


/**************************************************
** GAME EVENT HANDLERS
**************************************************/
var setEventHandlers = function() {
	// Keyboard
	window.addEventListener("keydown", onKeydown, false);
	window.addEventListener("keyup", onKeyup, false);

	// Window resize
	window.addEventListener("resize", onResize, false);

    socket.on("connect", onSocketConnected);
    socket.on("disconnect", onSocketDisconnect);
    socket.on("new player", onNewPlayer);
    socket.on("move player", onMovePlayer);
    socket.on("remove player", onRemovePlayer);
    socket.on("getFood", function(foods) {
        // todo: add the tweet as a DOM node
        //console.log(foods);
        //console.log("Getting the food array from server");

        /*console.log(foods);
        console.log("Getting the food array from server");
        */

        //array leegmaken
        foodsArray.length = 0;
        var index;
        for (index = 0; index < foods.length; ++index) {

            var tempFood = Food(foods[index].x, foods[index].y);
            foodsArray.push(tempFood);
            //foodsArray[index].draw(ctx);
        }

    });

};

// Keyboard key down
function onKeydown(e) {
	if (localPlayer) {
		keys.onKeyDown(e);
	};
};

// Keyboard key up
function onKeyup(e) {
	if (localPlayer) {
		keys.onKeyUp(e);
	};

};

// Browser window resize
function onResize(e) {
	// Maximise the canvas
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
};

function onSocketConnected() {
    console.log("Connected to socket server");

    socket.emit("new player", {x: localPlayer.getX(), y: localPlayer.getY(), points: localPlayer.getPoints(), name:localPlayer.name});

};

function onSocketDisconnect() {
    console.log("Disconnected from socket server");
};

function onNewPlayer(data) {
    console.log("New player connected: "+data.id);
    console.log(data);

    var newPlayer = new Player(data.x, data.y, data.points, data.name);
    newPlayer.id = data.id;
    remotePlayers.push(newPlayer);
    console.log(remotePlayers[0].getPoints());
    //console.log(data);
};


function onMovePlayer(data) {
    var movePlayer = playerById(data.id);

    if (!movePlayer) {
        console.log("Player not found: "+data.id);
        return;
    };

    movePlayer.setX(data.x);
    movePlayer.setY(data.y);
    movePlayer.setPoints(data.points);

    console.log("moveplayer: " + data.points);

};

function onRemovePlayer(data) {

    var removePlayer = playerById(data.id);

    if (!removePlayer) {
        console.log("Player not found: "+data.id);
        return;
    };

    remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1);

};




/**************************************************
** GAME ANIMATION LOOP
**************************************************/
function animate() {
	update();
	draw();

	// Request a new animation frame using Paul Irish's shim
	window.requestAnimFrame(animate);

};


/**************************************************
** GAME UPDATE
**************************************************/
function update() {

    // Maximise the canvas


    if (localPlayer.update(keys)) {
        socket.emit("move player", {x: localPlayer.getX(), y: localPlayer.getY()});
    };


    console.log()

};


/**************************************************
** GAME DRAW
**************************************************/
function draw() {
	// Wipe the canvas clean
	ctx.clearRect(0, 0, 500, 500);


	// Draw the local player
	localPlayer.draw(ctx);

    var i;
    for (i = 0; i < remotePlayers.length; i++) {
        remotePlayers[i].draw(ctx);
    };

    var i;
    for (i = 0; i < foodsArray.length; i++) {
        foodsArray[i].draw(ctx);
    };

};



function playerById(id) {
    var i;
    for (i = 0; i < remotePlayers.length; i++) {
        if (remotePlayers[i].id == id)
            return remotePlayers[i];
    };

    return false;
};
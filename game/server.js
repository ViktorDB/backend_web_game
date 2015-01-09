// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var util = require("util");				// Utility resources (logging, object inspection, etc)
var io = require("socket.io");				// Socket.IO

//var request = require('superagent');
//var expect = require('expect.js');

serverIP = "";

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

require('./gameServer.js');



var os=require('os');
//console.log("1" + os);
var ifaces=os.networkInterfaces();
//console.log("2" + ifaces);
for (var dev in ifaces) {
    //console.log("3" + dev);
    var alias=0;
    ifaces[dev].forEach(function(details){
        //console.log("4" + details);
        if (details.family=='IPv4' && details.internal === false) {
            //console.log(dev+(alias?':'+alias:''),details.address);
            serverIP = details.address;
            ++alias;
        }
    });
}

console.log("IP IP IP: " + serverIP);

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);





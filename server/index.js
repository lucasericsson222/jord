const {wss} = require('./webSocket.js');
const {parse} = require( './parse.js');
require("./database/database.js");


wss.on("clientConnect", function(ws) {
    wss.send(ws, "@G Please FF5733 enter the name of the character you wish to play as:");
});
wss.on('newMessage', function(ws, data) {
    if (ws.loggedIn) {
        console.log('received: ' + data);
        parse(ws, data);
    } else {
        ws.controllingPlayer = data;
        wss.send(ws, "You are now logged in as: " + data);
        ws.loggedIn = true;
    }
});


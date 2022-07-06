const {wss} = require('./webSocket.js');
const {parse} = require( './parse.js');

/*
wss.on('connect', function connection(ws) {
    wss.on('message', function message(data) {
        console.log('received: %s', data);
        wss.send("> " + data.toString());
        parse(data.toString(), ws);
    });
});
*/
wss.on("clientConnect", function(ws) {
    wss.send(ws, "Please enter the name of the character you wish to play as:");
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


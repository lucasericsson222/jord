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
wss.on('newMessage', function(ws, data) {
    console.log('received: ' + data);
    parse(ws, data);
});

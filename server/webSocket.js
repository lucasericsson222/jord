const {WebSocketServer} = require( 'ws');
var events = require('events');
const { send } = require('process');

class netInterface extends events {
    #wss;
    constructor(input) {
        super();
        this.#wss = new WebSocketServer(input);
        this.#wss.on('connection', (ws) => {
            ws.loggedIn = false;
            this.emit('clientConnect', ws);
            ws.on('message', (message) => {
                this.send(ws, "> " + message.toString()); //this just makes it so that the message appears back in the users stream
                this.emit('newMessage', ws, message.toString() );
            });
        });
    }
    send(ws, message) {
        ws.send(message);
    }
    broadcast(message) {
        this.#wss.clients.forEach((client) => {
            this.send(client, message);
        });
    }
}

const wss = new netInterface({port:3001});

module.exports = {wss};
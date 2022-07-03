const {WebSocketServer} = require( 'ws');
const {parse} = require( './parse.js');
const wss = new WebSocketServer({port:3001});

var commands = [
    {
        name: "echo",
        scheme: "echo $input",
        args: [
            {
                name: "input",
                type: "string",
            }
        ],
        handler: ({input}) => {
            return input + "Echooooo";
        }
    }
];

wss.on('connection', function connection(ws) {
    ws.on('message', function message(data) {
        console.log('received: %s', data);
        ws.send(data.toString());
        ws.send(parse(data.toString(), commands));
    });
});



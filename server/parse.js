const {WebSocketServer} = require( 'ws');
const WebSocket = require('ws');
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
        handler: ({input, wss, ws}) => {
            ws.send(input);
        }
    },
    {
        name: "say",
        scheme: "say $input",
        args: [
            {
                name: "input",
                type: "string",
            }
        ],
        handler: ({input, wss, ws}) => {
            wss.clients.forEach(function each(client) {
                if (client.readyState === WebSocket.OPEN) {
                  client.send(input);
                }
            });
        }
    }
];
var argumentTypes = [
    {
        type: "string",
        replace: "([a-z]+)",
        transform: (arg) => {
            return arg;
        }
    },
    {
        type: "number",
        replace: "([0-9]+)",
        transform: (arg) => {
            return parseInt(arg);
        }
    }
];

function parse (input, wss, ws) {
    //check all commands
    for(let c of commands){
      var reg = c.scheme
      for(let arg of c.args){
        var argumentType = argumentTypes.find(a => a.type === arg.type);
        if(argumentType == undefined){
          console.log("unsupported argumenttype")
          return;
        }
        reg = reg.replace("$" + arg.name, argumentType.replace)
      }
      var regExp = new RegExp(reg)
      var match = input.match(regExp)
      if(match){
        match.shift()
        var paramObj = {}
        for(var i = 0; i < c.args.length; i++){
          var argumentType = argumentTypes.find(a => a.type === c.args[i].type);
          paramObj[c.args[i].name] = argumentType.transform(match[i])
        }
        paramObj["ws"] = ws;
        paramObj["wss"] = wss;
        return c.handler(paramObj)
      }
    }
    console.log("no matching command found");
    return "No matching command found";
}
module.exports = {parse}
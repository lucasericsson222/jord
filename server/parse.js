const {wss} = require('./webSocket.js');
const {worldData} = require('./database/dataLoad');
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
        handler: ({input, ws}) => {
            ws.send(input);
        }
    },
    {
        name: "look",
        scheme: "look",
        args: [],
        handler: ({ws}) => {
            worldData.loadRoom([0,0,0]).then((room) => {
                ws.send(room.display());
            })
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
        handler: ({input, ws}) => {
           wss.broadcast(input);
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

function parse (ws, input) {
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
        return c.handler(paramObj)
      }
    }
    console.log("no matching command found");
    wss.send(ws, "No matching command found");
}
module.exports = {parse}
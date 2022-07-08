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
            wss.send(ws, input);
        }
    },
    {
        name: "look",
        scheme: "look",
        args: [],
        handler: ({ws}) => {
            worldData.getPlayer({name:ws.controllingPlayer}).then( (player) => {           
                worldData.loadRoom({id:player.room}).then((room) => {
                    wss.send(ws, room.display());
                    worldData.getPlayers().then((players) => {
                        players.forEach((person) => {
                            wss.send(ws,person.display(ws));
                        });
                    });
                });
            });
        }
    },
    {
        name: "move",
        scheme: "$input",
        args: [
            {
                name: "input",
                type: "direction",
            }
        ],
        handler: ({ws,input}) => {
            worldData.getPlayer({name:ws.controllingPlayer}).then( (player) => {           
                worldData.loadRoom({id:player.room}).then((room) => {
                    if ((room.exits)[input] === undefined) {
                        wss.send(ws, "Invalid Direction");
                    } else {
                        worldData.updatePlayer({id:player.id,room:(room.exits)[input]});
                    }
                });
            });
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
        replace: "(.*)",
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
    },
    {
        type: "direction",
        replace: "(north|south|east|west|up|down)",
        transform: (arg) => {
            return arg;
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
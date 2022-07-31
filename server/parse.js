const {wss} = require('./webSocket.js');
const {playerModel} = require('./database/models/player.js');
const {roomModel} = require('./database/models/room.js');
const { monsterModel } = require('./database/models/monsters/monster.js');
const {battlebase} = require("./battlebase");

function cardinalToCoord(myString) {
    var coord = {position:{
        x: 0,
        y: 0
    }};
    switch(myString) {
        case "north":
            coord.position.y -= 1;
            break;
        case "south":
            coord.position.y += 1;
            break;
        case "east":
            coord.position.x += 1;
            break;
        case "west":
            coord.position.x -= 1;
            break;
    }
    return coord;
}

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
        name: "flee",
        scheme: "flee",
        args: [],
        handler: async ({ws}) => {
            let myRoom = await roomModel.getRoomWithPlayer({name:ws.controllingPlayer});
            let myPlayer = await playerModel.findOne({name:ws.controllingPlayer});
            battlebase.getBattle(myRoom._id).removeObject({id:myPlayer.id});
        }
    },
    {
        name: "battle",
        scheme: "battle",
        args:[],
        handler: async ({ws}) => {
            let myPlayer = await playerModel.findOne({name:ws.controllingPlayer});
            if (await battlebase.isInBattle({_id:myPlayer.id})) {
                wss.send(ws,battlebase.getBattle(myPlayer.room).display());
            } else {
                battlebase.startBattle(myPlayer.room).then(() => {
                    wss.send(ws,battlebase.getBattle(myPlayer.room).display());
                });
            }
        }
    },
    {
        name: "look",
        scheme: "look",
        args: [],
        handler: ({ws}) => {
            playerModel.findOne({name:ws.controllingPlayer}, function(playerErr, myPlayer) {
                roomModel.findOne({id:myPlayer.room}, function(roomError, myRoom) {
                    myRoom.display(ws).then((value) => {
                        wss.send(ws, value);
                    });
                });
            });


            // worldData.getPlayer({name:ws.controllingPlayer}).then( (player) => {           
            //     worldData.loadRoom({id:player.room}).then((room) => {
            //         wss.send(ws, room.display());
            //         worldData.getPlayers().then((players) => {
            //             players.forEach((person) => {
            //                 wss.send(ws,person.display(ws));
            //             });
            //         });
            //     });
            // });
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
        handler: async ({ws,input}) => {
            let myRoom = await roomModel.getRoomWithPlayer({name:ws.controllingPlayer});
            if (await battlebase.isInBattle({name:ws.controllingPlayer})) {
                let objects = battlebase.getBattle(myRoom._id).objects
                for(let objId in objects) {
                    if(objects[objId].name == ws.controllingPlayer) {
                        let coord = cardinalToCoord(input);
                        objects[objId].position.x += coord.position.x;
                        objects[objId].position.y += coord.position.y;
                            
                        if (coord.position.x == 0 && coord.position.y == 0 ) {
                            wss.send(ws, "Invalid Direction in battle");
                        }
                    }
                }
                await parse(ws,"battle");
            } else {
                if ((myRoom.exits)[input] === undefined) {
                    wss.send(ws, "Invalid Direction");
                } else {
                    myPlayer.room = myRoom.exits[input]._id;
                    myPlayer.save();
                }
                await parse(ws, "look");
            }   
            
            // worldData.getPlayer({name:ws.controllingPlayer}).then( (player) => {           
            //     worldData.loadRoom({id:player.room}).then((room) => {
            //         if ((room.exits)[input] === undefined) {
            //             wss.send(ws, "Invalid Direction");
            //         } else {
            //             worldData.updatePlayer({id:player.id,room:(room.exits)[input]});
            //         }
            //     });
            // });
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

async function parse (ws, input) {
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
        return await c.handler(paramObj)
      }
    }
    console.log("no matching command found");
    wss.send(ws, "No matching command found");
}
module.exports = {parse}
var battleClass = require("./battle.js");
const { playerModel } = require("./database/models/player.js");
var {roomModel} = require("./database/models/room.js");
class battlebaseClass {
    constructor() {
        this.battles = {};
    }
    async startBattle(roomId) {
        
        let myRoom = await roomModel.findOne({_id:roomId});
        
        this.battles[roomId] = new battleClass(roomModel);
        let players = await myRoom.getPlayersInRoom();
        for(let playerId in players) {
            this.battles[roomId].addObject(players[playerId]);
        }

        let monsters = await myRoom.getMonstersInRoom();
        for(let monsterId in monsters) {
            this.battles[roomId].addObject(monsters[monsterId]);
        }
    }
    getBattle(roomId) {
        return this.battles[roomId];
    }
    async isInBattle(playerSearch) {
        // currently optimized to only check the room you are in
        let myRoom = await roomModel.getRoomWithPlayer(playerSearch);
        let myPlayer = await playerModel.findOne(playerSearch);
        let myBattle = this.getBattle(myRoom._id);
        if (myBattle?.getObject(myPlayer) != undefined){
            return true;
        }
        return false;
    }
}

var battlebase = new battlebaseClass();

module.exports = {battlebase};
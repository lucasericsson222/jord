var mongoose = require('mongoose');
var {Schema} = mongoose;
const { monsterModel } = require('./monsters/monster.js');
var {playerModel} = require("./player");


var roomSchema = new Schema({
    name: String,
    desc: String,
    exits: {
        type: Map,
        of: {
            type: Schema.Types.ObjectId,
            ref: "Room"
        }
    },
},
{
    methods: {
        async display(ws) {
            let output = this.displayRoom();
            output += await this.displayPlayers(ws);
            output += await this.displayMonsters();
            return output;
        },
        displayRoom() {
            let myoutput = "";
            myoutput += "######################################\n";
            myoutput += this.name + "\n";
            myoutput += "######################################\n";
            myoutput += this.desc + "\n";
            return myoutput;
        },
        async displayPlayers(ws) {
            let myoutput = "";
            let myPlayers = await this.getPlayersInRoom();
            myPlayers.forEach((person) => {
                myoutput += person.display(ws);
            });
            return myoutput;
        },
        async displayMonsters() {
            let myoutput = "";
            let myMonsters = await this.getMonstersInRoom();
            for(let monster in myMonsters) {
                myoutput += myMonsters[monster].display() + "\n";
            };
            return myoutput;
        },
        async getPlayersInRoom() {
            let myPlayers = await playerModel.find({room:this._id});
            return myPlayers;
        },
        async getMonstersInRoom() {
            let myMonsters = await monsterModel.find({room:this._id});
            let myMonstersAsTypes = [];
            for(let mId in myMonsters) {
                myMonstersAsTypes.push(await myMonsters[mId].asType());
            }
            return myMonstersAsTypes;
        }
    },
    statics: {
        async getRoomWithPlayer(playerObj) {
            let myPlayer = await playerModel.findOne(playerObj);
            let myRoom = await this.findOne({id:myPlayer.room});
            return myRoom;
        }
    }
});
var roomModel = mongoose.model('Room', roomSchema );
module.exports = {roomModel};



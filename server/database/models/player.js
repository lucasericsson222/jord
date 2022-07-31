var mongoose = require('mongoose');
var {Schema} = mongoose;

const playerSchema = new Schema({
    name: String,
    room: {
        type: Schema.Types.ObjectId,
        ref: "Room"
    },
    sym: String,
    position: {
        x:Number,
        y:Number
    }
}, 
{
    methods: {
        display(ws) {
            if (ws.controllingPlayer === this.name) {
                return "You are in this room.\n";
            } else {
                return this.name + " is in this room.\n";
            }
        }
    }
});
let playerModel = mongoose.model('Player', playerSchema )
module.exports = {playerModel};

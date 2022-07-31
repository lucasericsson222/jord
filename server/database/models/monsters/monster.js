var mongoose = require('mongoose');
var {Schema} = mongoose;

const monsterSchema = new Schema({
    name: String,
    room: {
        type: Schema.Types.ObjectId,
        ref: "Room"
    },
    __t: {
        type: String,
        default: "Monster"
    },
    sym: String,
    position: {
        x:Number,
        y:Number
    }
}, 
{
    methods: {
        display() {
            return this.name + " lurks in the room.";
        },
        async asType() {
            let output = await this.model(this.__t).findOne(this);
            return output;
        }
    }
});
const monsterModel = mongoose.model('Monster', monsterSchema );
module.exports = {monsterSchema, monsterModel};

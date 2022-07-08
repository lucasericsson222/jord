

class player {
    id;
    name;
    room;
    constructor(input) {
        this.id = input._id;
        this.name = input.name;
        this.room = input.room;
    }
    display(ws) {
        if (ws.controllingPlayer === this.name) {
            return "You are in this room.";
        } else {
            return this.name + " is in this room.";
        }
    }
}
module.exports = {player};


class player {
    id;
    name;
    room;
    constructor(id,name,room) {
        this.id = id;
        this.name = name;
        this.room = room;
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
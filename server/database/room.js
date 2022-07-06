class room {
    id;
    coords;
    name;
    desc;
    exits;
    constructor(id, coords, name, desc, exits) {
        this.id = id;
        this.coords = coords;
        this.name = name;
        this.desc = desc;
        this.exits = exits;
    }
    display() {
        let myoutput = "";
        myoutput += "######################################\n";
        myoutput += this.name + "\n";
        myoutput += "######################################\n";
        myoutput += this.desc;
        return myoutput;
    }
}
module.exports = {room};
/*
Hopefully; example design;

name="MyTestRoom";
desc="Welcome to the test room full of dangers and stuff";
exits={ 
    north: roomref,
    south: roomref2,
    east: roomref3,
    west: roomref4,
    up: roomref5,
    down: roomref6,
    bookshelf: roomref7
}
entities={
    mymonster
}



question of how to deal with the no rooms. I think de
*/

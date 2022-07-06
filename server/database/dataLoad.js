const roomClass = require('./room');
const {MongoClient, MONGO_CLIENT_EVENTS} = require('mongodb');

const uri = "mongodb://localhost:27017";


class dataLoad {
    async loadRoom(roomCoords) {
        let loadedRoom;
        const client = new MongoClient(uri);
        try {
            const database = client.db('jord');
            const rooms = database.collection('rooms');

            const query = {coords: roomCoords};
            const room = await rooms.findOne(query);
            loadedRoom = new roomClass.room(room._id,room.coords, room.name,room.desc,room.exits);
        } finally {
            await client.close();
        }
        return loadedRoom;
    }
    async saveRoom(room) {

    }
    // everything interactable is an entity
    // monsters, players, items, objects are all subsets
    
    async loadEntity() {

    }
    async saveEntity() {

    }
}

const worldData = new dataLoad();

module.exports = {worldData};
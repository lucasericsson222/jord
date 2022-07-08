const roomClass = require('./room');
const playerClass = require('./player.js');
const {MongoClient, MONGO_CLIENT_EVENTS} = require('mongodb');
const { client } = require('websocket');

const uri = "mongodb://localhost:27017";


class dataLoad {
    async loadRoom(input) {
        let query;
        if(input.coords === undefined) {
            query = {_id:input.id};
        } else {
            query = {coords:input.coords}
        }
        let loadedRoom;
        const client = new MongoClient(uri);
        try {
            const database = client.db('jord');
            const rooms = database.collection('rooms');

            const room = await rooms.findOne(query);
            loadedRoom = new roomClass.room(room._id,room.coords, room.name,room.desc,room.exits);
        } finally {
            await client.close();
        }
        return loadedRoom;
    }
    async getPlayer(input) {
        let loadedPlayer;
        let query;
        if (input.name === undefined) {
            if (input._id === undefined) {
                query = {room:input.room};
            } else {
                query = {_id:input.id};
            }
        } else {
            query = {name:input.name};
        }
        const client = new MongoClient(uri);
        try {
            const database = client.db('jord');
            const players = database.collection('players');

            const player = await players.findOne(query);
            
            loadedPlayer = new playerClass.player(player);
        } finally {
            await client.close();
        }
        return loadedPlayer;
    }
    async updatePlayer(input) {
        const client = new MongoClient(uri);
        try {

            const database = client.db('jord');
            const players = database.collection("players");

            const filter = {_id:input.id};
            delete input.id;
            const updateDoc = {
                $set: input
            };
            const options = {}
            const result = await players.updateOne(filter, updateDoc,options);
            return result;
        } finally {
            await client.close();
        }
    }
    async getPlayers() {
        const client = new MongoClient(uri);
        var playersFinal = [];
        try {
            const database = client.db('jord');
            const players = database.collection("players");

            let playersData = await players.find();
            await playersData.forEach((playerData)=> {
                let newPlayer = new playerClass.player(playerData);
                playersFinal.push(newPlayer);
            });
        } finally {
            await client.close();
            return playersFinal;
        }
    }
    async saveRoom(room) {

    }
}

const worldData = new dataLoad();

module.exports = {worldData};
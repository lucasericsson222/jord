// getting-started.js
const mongoose = require('mongoose');
const playerModel = require('./models/player.js');
const {roomModel} = require('./models/room.js');
const {skeletonModel} = require('./models/monsters/skeleton.js');
const { monsterModel } = require('./models/monsters/monster.js');
const { ObjectId } = require('mongodb');





main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/jord')

    /*monsterModel.findOne({name:"OTHER SKELETON"},function (err, myMonster) {
        if (myMonster.__t == "Skeleton") {
            console.log(myMonster.display());
            myMonster.asType(function(err, mySkeleton) {
                console.log(mySkeleton.display());
            });
        }
    });*/
    
    
}
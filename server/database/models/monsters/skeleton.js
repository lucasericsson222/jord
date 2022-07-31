var mongoose = require('mongoose');
var {Schema} = mongoose;

let {monsterSchema} = require("./monster.js");


let skeletonSchema = new Schema({
    name: {
        type: String,
        default: "Skeleton"
    },
    __t: {
        type: String,
        default: "Skeleton"
    }
}, {
    methods: {
        display() {
            return this.name + " rattles in the corner.";
        }
    }
});
skeletonSchema = monsterSchema.add(skeletonSchema);
const skeletonModel = mongoose.model("Skeleton", skeletonSchema, "monsters");
module.exports = {skeletonModel, skeletonSchema};

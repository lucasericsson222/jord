String.prototype.replaceAtIndex = function(_index, _newValue) {
    return this.substring(0, _index) + _newValue + this.substring(_index + _newValue.length)
}
class battleClass {
    /*
    . . . . .
    # . . . .
    . . . . .
    . . . @ .
    . . . . .
    */
    constructor(myRoom) {
        this.objects = [];
        this.background = [];
        this.room = myRoom;
    }
    display() {
        var myOutput = [];
        
        for(let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                myOutput.push(".");
            }
        }
        for(let object in this.objects) {
            // 11 because of new line
            let myObject = this.objects[object];
            myOutput[ myObject.position.x + 5 * myObject.position.y] = myObject.sym;
        }

        let myStringOutput = "";
        for(let char in myOutput) {
            myStringOutput += myOutput[char] + " ";
            if (char % 5 === 4) {
                myStringOutput += "\n";
            }
        }
        return myStringOutput;
    }
    addObject(object) {
        this.objects.push(object);
    }
    getObject(objdOfId) {
        for(let objId in this.objects) {
            if(this.objects[objId].id == objdOfId.id) {
                return this.objects[objId];
            }
        }
        return undefined;
    }
    removeObject(objOfId) {
        for(let objId in this.objects) {
            if(this.objects[objId].id == objOfId.id) {
                this.objects[objId].save();
                this.objects.splice(objId, 1);
                return true;
            }
        }
        return false;
    }
};

module.exports = battleClass;
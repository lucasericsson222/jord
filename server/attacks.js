import { wss } from "./webSocket";

function attack ({player, battle, input}) {
    cardinalToCoord(input)
    let monsterToHurt = battle.getAtPosition(add(player.position,cardinalToCoord(input)));
    let message = "The sword strike goes through the bones";
    let amount = 5;
    monsterToHurt.hurt(amount, message);
    wss.messagePlayer(player);
    wss.messageThoseInThisBattle(message);
}


/*
Currently trying to figure out best to handle the data weird stuff between different battlebase storage and database
currently thought is to only save once outside the battlebase
but then anyone who isn't in the battle is going to have unupdated data
other option:
save after every change to a model?
maybe make it so that the functions autosave?
only one person should have the definitive ownership of the player
so, i think that the database always should
it's too complicated to hand it off
and if I ever want to loosen up on how much the database saves, I just would need to modify the mongooose thing to be a fake
database
so, battlebase needs to only store references, and refresh the objects whenever they are accessed

*/

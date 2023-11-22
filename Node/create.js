var LOOPS = require('./loop.js');

var CREATE = function()
{
    console.log("CREAT Read INFO");
};

CREATE.prototype.LogMsg = function()
{
    console.log("CREATE Connect");
};

CREATE.prototype.generalInformation = function(ws,rooms){

    let obj;

    if(ws["room"] != undefined)
    {
        obj = {
            "type" : "info",
            "params" : {
                "room" : ws["room"],
                "no-clinets" : rooms[ws["room"]].length,
            }
        }
    }
    else
    {
        obj = {
            "type" : "info",
            "params" : {
                "room" : "no room",
            }
        }
    }

    ws.send(JSON.stringify(obj));
 }

 CREATE.prototype.createRoom = function(params, rooms, ws)
 {
    const room = this.genKey(5);
    console.log("room id : " +room);
    rooms[room] = [ws];
    ws["room"] = room;

    this.generalInformation(ws, rooms);

    var loop = new LOOPS();
    loop.StartLoops(params, rooms, ws, room);

 }
 
 CREATE.prototype.genKey= function(length){
    let result = '';
    const characters = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    for(let i = 0; i<length; i++)
    {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

module.exports = CREATE;

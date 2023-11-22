const WebSocket = require('ws');
var CREATE = require('./create.js');

const wss = new WebSocket.Server({ port:8000}, () =>{
    console.log('서버 시작');
});

const userList = [];
const maxClients = 5;
let rooms = {};
let joinuserTemp = 1;

wss.on('connection', function connection(ws){
    ws.clientID = genKey(8);

    var create = new CREATE();
    
    ws.on('message', (data)=> {
     const jsonData = JSON.parse(data);

     let requestType = jsonData.requestType; //리퀘스트 타입으로 결정
     let params = jsonData.message;         //파라미터 추가

     console.log('받은 데이터 : ', jsonData, requestType, params);
 
     if(requestType == 10) //유저 리스트
     {
         ws.send(JSON.stringify(userList));
     }

     if(requestType == 100)//방생성
     {
        create.createRoom(params, rooms, ws);
     }
     if(requestType == 200)//방 입장
     {
        joinRoom(params,ws);
     }
     if(requestType == 300)//방 퇴실
     {
        leaveRoom(params);
     }

     if(requestType == 0) //전체 에코
     {
        wss.clients.forEach((client)=>
        {
            client.send(data);  // 받은 데이터를 모든 클라이언트에게 전송
        })
     }
 
    });
 
    ws.on('close', ()=>{
     const index = userList.indexOf(ws.clientID);
     if(index !==-1)
     {
         console.log('클라이언트가 헤제됨 - ID :', ws.clientID);
         userList.splice(index,1);
     }
    });
 
    userList.push(ws.clientID);
    ws.send(JSON.stringify({clientID : ws.clientID}));
    console.log('클라이언트 연결 - ID :', ws.clientID);
 })

 function generalInformation(ws){
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

 function joinRoom(params, ws)
 {
    const room = params;
    if(!Object.keys(rooms).includes(room))
    {
        console.warn('does net exist');
        return;
    }

    if(rooms[room].length >= maxClients){
        console.warn(room + ' is full');
        return;
    }

    rooms[room].push(ws);
    ws["room"]= rooms;

    generalInformation(ws);

    var userList = "";

    for(let i = 0; i < rooms[room].length; i++)
    {
        userList +="User : " +rooms[room][i].user +"\n";
    }
    joinuserTemp +=1;

    obj = {
        "type" : "info",
        "myParams" : {
            "room" : ws["room"],
            "UserList" : UserList
        }
    }

    for(var i = 0; i < rooms[room].length; i++)
    {
        rooms[room][i].send(JSON.stringify(obj));
    }

 }

 function leaveRoom(params)
 {
    const room = ws.room;

    if(rooms[room].length > 0)
    {
        rooms[room] = rooms[room].filter(so => so !== ws);

        ws["room"] = undefined;

        if(rooms[room].length ==0)
        {
            close(room);
        }
    }

    function close(room){
        if(rooms.length > 0)
        rooms = rooms.filter(key => key !== room);
    }

 }


 wss.on('listening', () => {
    console.log('리스닝....');
});

function genKey(length){
    let result = '';
    const characters = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    for(let i = 0; i<length; i++)
    {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
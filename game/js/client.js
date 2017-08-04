var Client = {};
Client.socket = io.connect();

//Requests from Client to Server
Client.askNewPlayer = function(){
    Client.socket.emit('newplayer');
};

Client.sendClick = function(x,y){
  console.log(x + ", " + y);
  Client.socket.emit('click',{x:x,y:y});
};

Client.sendUpdate = function(speed, dir){
  Client.socket.emit('updatePos', {speed: speed, dir: dir});
}

//Socket Client Catches
Client.socket.on('newplayer',function(data){
    playState.addNewPlayer(data.id,data.x,data.y);
});

Client.socket.on('allplayers',function(data){
    // console.log(data);
    for(var i = 0; i < data.length; i++){
        playState.addNewPlayer(data[i].id,data[i].x,data[i].y);
    }

    Client.socket.on('move',function(data){
        playState.movePlayer(data.id,data.x,data.y);
    });

    Client.socket.on('update',function(data){
        playState.movePlayer(data.id,data.x,data.y, data.dir);
    });

    Client.socket.on('remove',function(id){
        playState.removePlayer(id);
    });
});

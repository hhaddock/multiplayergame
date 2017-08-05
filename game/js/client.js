var Client = {};
Client.socket = io.connect();

//Requests from Client to Server
Client.askNewPlayer = function(){
  Client.socket.emit('newplayer');
};

Client.sendUpdate = function(speed, dir){
  Client.socket.emit('updatePos', {speed: speed, dir: dir});
}

Client.sendRot = function(x, y){
  Client.socket.emit('updateRot', {x: x, y: y});
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

  Client.socket.on('updateRot',function(data){
    playState.rotatePlayer(data.id, data.angle);
  });

  Client.socket.on('remove',function(id){
    playState.removePlayer(id);
  });
});

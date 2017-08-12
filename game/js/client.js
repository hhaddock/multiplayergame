var Client = {};
Client.socket = io.connect();

//Requests from Client to Server
Client.askNewPlayer = function(){
    Client.socket.emit('newplayer');
}

Client.spawnEnemies = function(){
    Client.socket.emit('spawnEnemies');
}

Client.sendUpdate = function(speed, dir){
    Client.socket.emit('updatePos', {speed: speed, dir: dir});
}

Client.sendRot = function(x, y){
    Client.socket.emit('updateRot', {x: x, y: y});
}

Client.sendMouse = function( data ) {
    Client.socket.emit( 'moveToMouse', { status: data } );
}

Client.sendFire = function(){
  Client.socket.emit('playerFire', {fire: true});
}

Client.sendOverlap = function(){
  Client.socket.emit('shotHit');
}

//Socket Client Catches
Client.socket.on('newplayer',function(data){
    playState.addNewPlayer(data.id,data.x,data.y);
});

Client.socket.on('allplayers',function(data){
  for(var i = 0; i < data.length; i++){
    playState.addNewPlayer(data[i].id,data[i].x,data[i].y);
  }

  Client.socket.on('spawnEnemies', function(data){
    playState.spawnEnemy(data);
  });

  Client.socket.on('move',function(data){
    playState.movePlayer(data.id,data.x,data.y);
  });

  Client.socket.on('update',function(data){
    playState.movePlayer(data.id,data.x,data.y, data.dir);
  });

  Client.socket.on('updateRot',function(data){
    playState.rotatePlayer( data.id, data.x, data.y );
  });

  Client.socket.on( 'moveToMouse', function( data ) {
    playState.movePlayerToMouse( data.plyr.id, data.status );
  });

  Client.socket.on('playerFire', function(data){
    playState.playerFire(data.id, data.fire);
  });

  Client.socket.on('shotHit', function(data){
    playState.shotHit(data.id);
  })

  Client.socket.on('remove',function(id){
    playState.removePlayer(id);
  });
});

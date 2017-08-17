var Client = {};
Client.socket = io.connect();

//Requests from Client to Server
Client.askNewPlayer = function(){
  Client.socket.emit('newplayer');
}

Client.spawnEnemies = function(){
  Client.socket.emit('spawnEnemies');
}

Client.SendAiUpdate = function(){
  Client.socket.emit('updateAiPosition');
}

Client.sendPlayerMovement = function(dir, numKeys, shift){
  Client.socket.emit('sendPlayerMovementUpdate', {dir: dir, totalKeys: numKeys, sprint: shift});
}

Client.showArrows = function(){
  Client.socket.emit('showArrows');
}

Client.hideArrows = function(){
  Client.socket.emit('hideArrows');
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

Client.sendReload = function(){
  Client.socket.emit('playerReload');
}

Client.sendHit = function(bullet, enemy){
  Client.socket.emit('shotHit', {enemy: enemy.id});
  bullet.kill();
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

  Client.socket.on('updatePlayerPosition',function(data){
    playState.movePlayer(data.player.id,data.player.x,data.player.y, data.dir, data.totalKeys, data.sprint);
  });

  Client.socket.on('updateAiPosition',function(data){
    playState.moveAI();
  });

  Client.socket.on('updateRot',function(data){
    playState.rotatePlayer( data.id, data.x, data.y );
  });
  Client.socket.on('playerFire', function(data){
    playState.playerFire(data.id, data.fire);
  });

  Client.socket.on('playerReload', function(data){
    playState.playerReload(data.id);
  });

  Client.socket.on('shotHit', function(data){
    playState.shotHit(data.id, data.player, data.enemy);
  });

  Client.socket.on('remove',function(id){
    playState.removePlayer(id);
  });
});

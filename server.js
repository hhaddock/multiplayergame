var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

app.use('/css', express.static(__dirname + '/game/css'));
app.use('/js', express.static(__dirname + '/game/js'));
app.use('/assets', express.static(__dirname + '/game/assets'));

app.get('/',function(req,res){
    res.sendFile(__dirname+'/game/index.html');
});

server.listen(3500,function(){
    console.log('Listening on '+ server.address().port);
});

server.lastPlayerID = 0; // Keep track of the last id assigned to a new player
server.enemyID = 0;
io.on('connection',function(socket){
    socket.on('spawnEnemies', function(data){
      var enemies = [];
      for(i = 0; i < 10; i++){
        var enemy = {
          id: server.enemyID++,
          x: randomInt(0, 1020),
          y: randomInt(0, 720)
        }
        enemies.push(enemy)
        io.emit('spawnEnemies', enemy);
      }
    });

    socket.on('newplayer',function(data){
        socket.player = {
            id: server.lastPlayerID++,
            x: randomInt(200,400),
            y: randomInt(200,400),
            dir: "up",
            angle: 0
        };
        socket.emit('allplayers', getAllPlayers());
        socket.broadcast.emit('newplayer', socket.player);

        socket.on('updatePos', function(data){
          socket.player.dir = data.dir;
          io.emit('update',socket.player);
        });

        socket.on('updateRot', function(data){
          io.emit('updateRot', { id: socket.player.id, x: data.x, y: data.y });
        });

        socket.on( 'moveToMouse', function( data ) {
          io.emit( 'moveToMouse', { plyr: socket.player, status: data.status } );
        });

        socket.on('playerFire', function(data){
          io.emit('playerFire', {id: socket.player.id, fire: data.fire});
        });

        socket.on('shotHit', function(data){
          io.emit('shotHit', {id: socket.player.id,player: data.player, enemy: data.enemy});
        });

        socket.on('showArrows', function(data){
          io.emit('showArrows', socket.player.id);
        });

        socket.on('hideArrows', function(data){
          io.emit('hideArrows', socket.player.id);
        });

        socket.on('disconnect',function(){
          io.emit('remove',socket.player.id);
        });
    });
});

function getAllPlayers(){
    var players = [];
    Object.keys(io.sockets.connected).forEach(function(socketID){
      var player = io.sockets.connected[socketID].player;
      if(player) players.push(player);
    });
    return players;
}

function randomInt (low, high) {
  return Math.floor(Math.random() * (high - low) + low);
}

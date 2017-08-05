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

server.lastPlayderID = 0; // Keep track of the last id assigned to a new player

io.on('connection',function(socket){
    socket.on('newplayer',function(data){
        socket.player = {
            id: server.lastPlayderID++,
            x: randomInt(100,400),
            y: randomInt(100,400),
            dir: "up",
            angle: 0
        };
        socket.emit('allplayers',getAllPlayers());
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
    console.log(players);
    return players;
}

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

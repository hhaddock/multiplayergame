var playState = {};
var speed = 2;
playState.init = function(){
  game.stage.disableVisibilityChange = true;
}

playState.create = function(){
  //Test Text
  this.scoreText = game.add.text(game.world.centerX - 100, 10, 'Alpha Version 1.0', { fontSize: '16px', fill: '#fff' });
  //console.log for testing
  console.log("In playState");
  //array of all players id, x, y
  this.playerMap = {};
  //ask the server to add a new player
  Client.askNewPlayer();
};

playState.update = function(){
  if(game.input.keyboard.justPressed(Phaser.Keyboard.ENTER)) {
    playState.getCoordinates();
  }
  playState.playerMovement();
};

playState.getCoordinates = function(){
  Client.sendClick(playState.getRandNum(100,500), playState.getRandNum(100,500));
}

playState.playerMovement = function() {
  if(game.input.keyboard.isDown(Phaser.Keyboard.A) && game.input.keyboard.isDown(Phaser.Keyboard.W))
    speed = 1.5;
  else if(game.input.keyboard.isDown(Phaser.Keyboard.D) && game.input.keyboard.isDown(Phaser.Keyboard.W))
    speed = 1.5;
  else if(game.input.keyboard.isDown(Phaser.Keyboard.A) && game.input.keyboard.isDown(Phaser.Keyboard.S))
    speed = 1.5;
  else if(game.input.keyboard.isDown(Phaser.Keyboard.D) && game.input.keyboard.isDown(Phaser.Keyboard.S))
    speed = 1.5;
  else
    speed = 2;

  if (game.input.keyboard.isDown(Phaser.Keyboard.A))
    playState.getPlayerLocation(speed, "left");
  else if (game.input.keyboard.isDown(Phaser.Keyboard.D))
    playState.getPlayerLocation(speed, "right");
  if (game.input.keyboard.isDown(Phaser.Keyboard.W))
    playState.getPlayerLocation(speed, "up");
  else if (game.input.keyboard.isDown(Phaser.Keyboard.S))
    playState.getPlayerLocation(speed, "down");
}

playState.getPlayerRotation = function(){

}

playState.getPlayerLocation = function(speed, dir){
  Client.sendUpdate(speed, dir);
}

playState.movePlayer = function(id, x, y, dir){
  var player = playState.playerMap[id];
  console.log(dir);
  if(dir == "left")
    player.x -= speed;
  else if(dir == "right")
    player.x += speed;
  else if(dir == "up")
    player.y -= speed;
  else if(dir == "down")
    player.y += speed;
};

playState.addNewPlayer = function(id,x,y){
    playState.playerMap[id] = game.add.sprite(x,y,'block');
    console.log("Added Player " + id + " " + "("+x + ", "+ y+")");
};

playState.removePlayer = function(id){
    console.log("Deleted Player " + id);
    playState.playerMap[id].destroy();
    delete playState.playerMap[id];
};

playState.getRandNum = function(min, max){
  return Math.random() * (max - min) + min;
}

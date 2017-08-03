var playState = {};

playState.init = function(){
  game.stage.disableVisibilityChange = true;
}

playState.create = function(){
  game.input.mouse.capture = true;
  //Test Text
  this.scoreText = game.add.text(game.world.centerX - 100, 16, 'Alpha Version 1.0', { fontSize: '16px', fill: '#fff' });
  //console.log for testing
  console.log("In playState");
  //array of all players id, x, y
  this.playerMap = {};
  //ask the server to add a new player
  Client.askNewPlayer();
};

playState.update = function(){
  if (game.input.keyboard.justPressed(Phaser.Keyboard.ENTER))
  {
    playState.getCoordinates();
  }
};

playState.getCoordinates = function(){
  Client.sendClick(playState.getRandNum(100,500), playState.getRandNum(100,500));
}

playState.movePlayer = function(id, x, y){
  var player = playState.playerMap[id];
  var tween = game.add.tween(player);
  tween.to({x:x,y:y});
  tween.start();
  console.log("Player has moved")
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

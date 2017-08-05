var loadState = {};

loadState.preload = function(){
  game.load.image('block', 'assets/dir.png');
}

loadState.create = function(){
  console.log("In loadState");
  game.state.start('play');
}

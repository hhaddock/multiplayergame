var loadState = {};

loadState.preload = function(){
  game.load.image('block', 'assets/test.png');
}

loadState.create = function(){
  console.log("In loadState");
  game.state.start('play');
}

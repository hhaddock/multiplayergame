var loadState = {};

loadState.preload = function(){
    game.load.image('block', 'assets/player.png');
}

loadState.create = function(){
    console.log("In loadState");
    game.state.start('play');
}

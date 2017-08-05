var loadState = {};

loadState.preload = function(){
    game.load.image('block', 'assets/player.png');
    game.load.image('bullet', 'assets/bullet.png');

}

loadState.create = function(){
    console.log("In loadState");
    game.state.start('play');
}

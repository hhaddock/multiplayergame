var loadState = {};

loadState.preload = function(){
    game.load.image('block', 'assets/player.png');
    game.load.image('bullet', 'assets/bullet.png');
    game.load.image('bg', 'assets/bg.png');
}

loadState.create = function(){
    game.state.start('play');
}

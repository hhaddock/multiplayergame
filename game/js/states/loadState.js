var loadState = {};

loadState.preload = function(){
    game.load.image('p1', 'assets/players/player1.png');
    game.load.image('p2', 'assets/players/player2.png');
    game.load.image('p3', 'assets/players/player3.png');
    game.load.image('p4', 'assets/players/player4.png');

    game.load.image('bullet', 'assets/bullet.png');
    game.load.image('bg', 'assets/bg.png');
}

loadState.create = function(){
    game.state.start('play');
}

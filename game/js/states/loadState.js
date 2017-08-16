var loadState = {};

loadState.preload = function(){
    //load Player assets
    game.load.image('p1', 'assets/players/player1.png');
    game.load.image('p2', 'assets/players/player2.png');
    game.load.image('p3', 'assets/players/player3.png');
    game.load.image('p4', 'assets/players/player4.png');

    //Load Enemy Assets
    game.load.image('enemy', 'assets/players/enemy.png');

    //load UI elements
    game.load.image('heart', 'assets/ui/heart.png');
    //arrows
    game.load.image('up', 'assets/ui/arrows/up.png');
    game.load.image('down', 'assets/ui/arrows/down.png');
    game.load.image('left', 'assets/ui/arrows/left.png');
    game.load.image('right', 'assets/ui/arrows/right.png');

    //Other
    game.load.image('bullet', 'assets/players/bullet.png');
    game.load.image('bg', 'assets/wood.png');

    //Audio
    game.load.audio('gunShot', 'assets/audio/gunShot.wav');
    game.load.audio('gunReload', 'assets/audio/gunReload.wav');
    game.load.audio('enemyHit', 'assets/audio/enemyHit.wav');
}

loadState.create = function(){
    game.state.start('play');
}

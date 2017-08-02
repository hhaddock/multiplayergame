var game = new Phaser.Game(960, 576, Phaser.AUTO, 'game');

game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('play', playState);

game.state.start('boot');
console.log("TEst");

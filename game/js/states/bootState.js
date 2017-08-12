var bootState = {};

bootState.create = function() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.world.setBounds(0,0, 1020, 720);

  game.state.start('load');
}

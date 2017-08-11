var bootState = {};

bootState.create = function() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.world.setBounds(0,0, 2000, 2000);

  game.state.start('load');
}

var bootState = {};

bootState.create = function() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.world.bounds.setTo(0,0, 960, 576);

  game.state.start('load');
  console.log("In bootState");
}

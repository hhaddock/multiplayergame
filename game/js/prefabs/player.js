var Player = function(game, id, x, y, sprite){
  this.game = game;
  this.id = id;
  this.speed = 3;

  Phaser.Sprite.call(this, game, x, y, sprite);
  this.game.physics.arcade.enable(this);

  this.body.collideWorldBounds = true;
  this.anchor.set( 0.5 );

  //Weapon Info
  this.weapon = game.add.weapon(30, 'bullet');
  this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
  this.weapon.bulletSpeed = 1200;
  this.weapon.fireRate = 100;
  this.weapon.trackSprite(this, 45, 25, true);

  //Name Plate
  this.namePlate = game.add.text(-2, 30, 'Player', { fontSize: '10px', fill: '#fff' });
  this.addChild(this.namePlate);
  this.game.add.existing(this);
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.test = function(){
  console.log("test");
}

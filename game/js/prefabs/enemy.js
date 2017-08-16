var Enemy = function(game, id, x, y, sprite){
  this.game = game;
  this.id = id;
  this.speed = 3;

  Phaser.Sprite.call(this, game, x, y, sprite);
  this.game.physics.arcade.enable(this);

  this.body.collideWorldBounds = true;
  this.anchor.set( 0.5 );

  this.killSound = game.add.audio('enemyHit');
  this.killSound.volume = 0.4;

  //Name Plate
  this.namePlate = game.add.text(-2, 30, 'Enemy' + (id + 1), { fontSize: '10px', fill: '#000' });
  this.addChild(this.namePlate);
  this.game.add.existing(this);
}

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.test = function(){
  console.log("test");
}

Enemy.prototype.playKillSound = function(){
  this.killSound.play();
}

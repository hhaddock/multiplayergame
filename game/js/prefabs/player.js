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
  this.namePlate = game.add.text(-2, 30, 'Player' + (id + 1), { fontSize: '10px', fill: '#000' });
  this.addChild(this.namePlate);
  this.game.add.existing(this);
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.movePlayer = function(id, x, y, dir){
  if(dir == "left")
      this.x -= speed;
  else if(dir == "right")
      this.x += speed;
  else if(dir == "up")
      this.y -= speed;
  else if(dir == "down")
      this.y += speed;
  game.physics.arcade.overlap(this.weapon.bullets, playState.enemies, Client.sendOverlap);
}

Player.prototype.rotatePlayer = function(id, x, y){
  this.angle = Math.atan2( y - this.y, x - this.x ) * 180 / Math.PI;
  game.physics.arcade.overlap(this.weapon.bullets, this.enemy, Client.sendOverlap);
}

Player.prototype.getPlayer = function(id){
  return id;
}

Player.prototype.playerFire = function(id, fire){
  if(fire)
    this.weapon.fire();
  game.physics.arcade.overlap(this.weapon.bullets, this.enemy, Client.sendOverlap);
}

Player.prototype.shotHit = function(id, enemy, bullet){
  enemy.kill();
  bullet.kill();
  game.camera.shake(0.01, 250);
}

Player.prototype.movePlayerToMouse = function(id, mouse_drag){
  if(mouse_drag){
      /* If true was passed by mouseMove() then begin moving the player
       * towards mouse position.
       */
      game.physics.arcade.moveToPointer(this, 400);
      /* If the player is within the bounds of the mouse's position
       * then reset player's velocity.
       */
      if(Phaser.Rectangle.contains(this.body, game.input.x, game.input.y)){
          this.body.velocity.setTo(0, 0);
      }
  } else {
      /* Resets player velocity to prevent continuous movement
       */
      this.body.velocity.setTo(0, 0);
  }
}

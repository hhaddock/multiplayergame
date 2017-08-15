var Player = function(game, id, x, y, sprite){
  this.game = game;
  this.id = id;
  this.speed = 3;

  Phaser.Sprite.call(this, game, x, y, sprite);
  this.game.physics.arcade.enable(this);

  this.body.collideWorldBounds = true;
  this.anchor.set( 0.5 );

  //UI Groups
  this.health = game.add.group();
  this.arrows = game.add.group();
  this.setUI();

  //Weapon Info
  this.weapon = game.add.weapon(30, 'bullet');
  this.weapon.fireRate = 400;
  this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
  this.weapon.bulletSpeed = 2400;
  this.weapon.trackSprite(this, 45, 25, true);

  //Name Plate
  this.namePlate = game.add.text(-2, 30, 'Player' + (id + 1), { fontSize: '12px', fill: '#000' });
  this.addChild(this.namePlate);
  this.game.add.existing(this);
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.setUI = function(){
  // this.showArrows();
  for(i = 0; i < 3; i++){
    this.health.create(i * 32, 0, 'heart');
  }
}

Player.prototype.showArrows = function(){
  this.arrows.scale.setTo(2);
  this.arrows.create(game.world.centerX /2, 0, 'up');
  this.arrows.create(game.world.centerX/2, 335, 'down');
  this.arrows.create(0, game.world.centerY / 2, 'left');
  this.arrows.create(510, game.world.centerY/2, 'right');
  this.arrows.alpha = 1;
}

Player.prototype.hideArrows = function(){
  this.arrows.alpha = 0;
}

Player.prototype.movePlayer = function(id, x, y, dir){
  if(dir == "left")
      this.x -= speed;
  else if(dir == "right")
      this.x += speed;
  else if(dir == "up")
      this.y -= speed;
  else if(dir == "down")
      this.y += speed;
}

Player.prototype.rotatePlayer = function(id, x, y){
  this.angle = Math.atan2( y - this.y, x - this.x ) * 180 / Math.PI;
  game.physics.arcade.overlap(this.weapon.bullets, playState.enemies, Player.getHit, null, this);
}

Player.getHit = function(bullet, enemy){
  Client.sendHit(bullet, enemy);
}

Player.prototype.getPlayer = function(id){
  return id;
}

Player.prototype.playerFire = function(id, fire){
  if(fire)
    this.weapon.fire();
}

Player.prototype.shotHit = function(player, enemy){
  playState.enemies.forEach(function(en){
    if(en.id == enemy){
      en.kill();
    }
  });
  game.camera.shake(0.01, 250);
}

Player.prototype.render = function(){
  // game.debug.body(this);
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

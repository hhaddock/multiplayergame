var Player = function(game, id, x, y, sprite){
  this.game = game;
  this.id = id;
  this.speed = 3;
  this.bullets = 5;

  Phaser.Sprite.call(this, game, x, y, sprite);
  this.game.physics.arcade.enable(this);

  this.body.collideWorldBounds = true;
  this.anchor.set( 0.5 );

  //UI Groups
  this.health = game.add.group();
  this.arrows = game.add.group();

  //Weapon Info
  this.weapon = game.add.weapon(this.bullets, 'bullet');
  this.weapon.fireRate = 400;
  this.weapon.fireLimit = 5;
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

Player.prototype.setUI = function(id, x, y){
  if(id == 0){
    this.ammo = game.add.text(40, 675, this.bullets + "/5", { fontSize: '26px', fill: '#fff' });
    for(i = 0; i < 3; i++){
      this.health.create((i*32) + 40, 700, 'heart');
    }
  } else if(id == 1){
    this.ammo = game.add.text(312, 675, this.bullets + "/5", { fontSize: '26px', fill: '#fff' });
    for(i = 0; i < 3; i++){
      this.health.create((i*32) + 312, 700, 'heart');
    }
  } else if(id == 2){
    this.ammo = game.add.text(584, 675, this.bullets + "/5", { fontSize: '26px', fill: '#fff' });
    for(i = 0; i < 3; i++){
      this.health.create((i*32) + 584, 700, 'heart');
    }
  } else if(id == 3){
    this.ammo = game.add.text(856, 675, this.bullets + "/5", { fontSize: '26px', fill: '#fff' });
    for(i = 0; i < 3; i++){
      this.health.create((i*32) + 856, 700, 'heart');
    }
  }
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

Player.prototype.playerFire = function(id, fire){
  if(fire){
    this.weapon.fire();
    this.ammo.text = (this.bullets - this.weapon.shots) + "/5"
  }
}

Player.prototype.playerReload = function(id){
  this.weapon.resetShots();
  this.ammo.text = (this.bullets) + "/5"
}

Player.prototype.shotHit = function(player, enemy){
  playState.enemies.forEach(function(en){
    if(en.id == enemy){
      en.kill();
    }
  });
  game.camera.shake(0.01, 250);
}

Player.prototype.movePlayerToMouse = function(id, mouse_drag){
  if(mouse_drag){
      game.physics.arcade.moveToPointer(this, 400);
      if(Phaser.Rectangle.contains(this.body, game.input.x, game.input.y)){
        this.body.velocity.setTo(0, 0);
      }
  }else {
      this.body.velocity.setTo(0, 0);
  }
}

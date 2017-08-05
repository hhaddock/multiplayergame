var playState = {};
var Keys = {};
var speed = 2;

playState.init = function(){
    game.stage.disableVisibilityChange = true;
}

playState.create = function(){
    game.input.mouse.capture = true;

    this.alphaText = game.add.text(game.world.centerX - 100, 10, 'Alpha Version 1.0', { fontSize: '16px', fill: '#fff' });
    //Create array of players
    this.playerMap = game.add.group();
    //ask the server to add a new player
    Client.askNewPlayer();

    /* Added this for modularity, and because I got tired of typing
     * it out every time
     */
    Keys = {
        W     : game.input.keyboard.addKey(Phaser.Keyboard.W),
        A     : game.input.keyboard.addKey(Phaser.Keyboard.A),
        S     : game.input.keyboard.addKey(Phaser.Keyboard.S),
        D     : game.input.keyboard.addKey(Phaser.Keyboard.D),
        SHIFT : game.input.keyboard.addKey(Phaser.Keyboard.SHIFT),
        FIRE  : game.input.activePointer.leftButton
    };
    this.enemy = game.add.sprite(500,500, 'block');
    game.physics.enable( this.enemy, Phaser.Physics.ARCADE );
    this.enemy.body.collideWorldBounds = true;
};

playState.update = function(){
    game.physics.arcade.collide(playState.playerMap);
    playState.playerMovement();
    // playState.mouseMove();
    playState.playerRot();
    playState.sendCollisions();

    if(Keys.FIRE.isDown){
      playState.sendFire();
    }

};

playState.sendCollisions = function(){
  game.physics.arcade.collide(playState.playerMap[0], this.enemy);
}

playState.sendFire = function(){
 Client.sendFire();
}

playState.playerFire = function(id, fire){
  var player = playState.playerMap[id];
  if(fire){
    player.weapon.fire();
  }
}

playState.mouseMove = function() {
    /* Added a check for if the shift key isDown as it might be an interesting
     * game mechanic to not be able to shoot and sprint at the same time.
     */
    if(game.input.mousePointer.isDown && Keys.SHIFT.isDown){
        /* Passes true to initiate drag
         */
        Client.sendMouse(true);
    } else {
        /* Seems redundant but without passing false the player
         * continues in the same direction.
         */
        Client.sendMouse(false);
    }
};

playState.movePlayerToMouse = function(id, mouse_drag) {
    var player = playState.playerMap[id];

    if(mouse_drag){
        /* If true was passed by mouseMove() then begin moving the player
         * towards mouse position.
         */
        game.physics.arcade.moveToPointer(player, 400);
        /* If the player is within the bounds of the mouse's position
         * then reset player's velocity.
         */
        if(Phaser.Rectangle.contains(player.body, game.input.x, game.input.y)){
            player.body.velocity.setTo(0, 0);
        }
    } else {
        /* Resets player velocity to prevent continuous movement
         */
        player.body.velocity.setTo(0, 0);
    }
};

playState.playerRot = function(){
    var x = game.input.mousePointer.x;
    var y = game.input.mousePointer.y;
    Client.sendRot(x, y);
};

playState.playerMovement = function() {
    direction = "stop";
    var num_pressed = 0;
    var key;
    for(key in Keys) {
        /* If one of the Key elements isDown then run the switch
         * to get new player direction
         */
        if(Keys[key].isDown){
            num_pressed++;
            switch(Keys[key]){
                case Keys.W:
                    direction = "up";
                    break;
                case Keys.S:
                    direction = "down";
                    break;
                case Keys.A:
                    direction = "left";
                    break;
                case Keys.D:
                    direction = "right";
                    break;
            }
            /* The main purpose of this for loop and switch statement is
             * to prevent making the getPlayerLocation() call on every update
             * when the player's position hasn't changed.
             */
            playState.getPlayerLocation(speed, direction);
        }
        /* Bitwise if to check if more than one key has been pressed and
         * adjust speed accordingly.
         */
        speed = (num_pressed > 1) ? 1.5 : 2;
    }
}

playState.getPlayerLocation = function(speed, dir){
    Client.sendUpdate(speed, dir);
}

playState.rotatePlayer = function(id, x, y){
    /* I moved the rotation math out of server.js because it was leaving its
     * rotation point at its initial spawn location.
     */
    var player = playState.playerMap[ id ];
    player.angle = Math.atan2( y - player.y, x - player.x ) * 180 / Math.PI;
}

playState.movePlayer = function(id, x, y, dir){
    var player = playState.playerMap[id];
    if(dir == "left")
        player.x -= speed;
    else if(dir == "right")
        player.x += speed;
    else if(dir == "up")
        player.y -= speed;
    else if(dir == "down")
        player.y += speed;
    game.physics.arcade.overlap(player.weapon.bullets, this.enemy, Client.sendOverlap);
};

playState.addNewPlayer = function(id,x,y){
    playState.playerMap[id] = game.add.sprite(x,y,'block');
    /* Added these lines to enable the drag functionality and for world
     * bounds collisions.
     */
    game.physics.enable( playState.playerMap[id], Phaser.Physics.ARCADE );
    playState.playerMap[id].body.collideWorldBounds = true;
    playState.playerMap[id].anchor.set( 0.5 );
    //Weapon Information
    playState.playerMap[id].weapon = game.add.weapon(30, 'bullet');
    playState.playerMap[id].weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    playState.playerMap[id].weapon.bulletSpeed = 1200;
    playState.playerMap[id].weapon.fireRate = 100;
    playState.playerMap[id].weapon.trackSprite(playState.playerMap[id], 45, 25, true);
    //name plate
    this.namePlate = game.add.text(-2, 30, 'Player ' + (id + 1), { fontSize: '10px', fill: '#fff' });
    playState.playerMap[id].addChild(this.namePlate);
    // console.log("Added Player " + id + " " + "("+x + ", "+ y+")");

    console.log(playState.playerMap[id].weapon);
};

playState.shotHit = function(){
  this.enemy.kill();
}

playState.removePlayer = function(id){
    console.log("Deleted Player " + id);
    playState.playerMap[id].destroy();
    delete playState.playerMap[id];
};

playState.getRandNum = function(min, max){
    return Math.random() * (max - min) + min;
}

playState.render = function(){
  // game.debug.body(this.enemy);
}

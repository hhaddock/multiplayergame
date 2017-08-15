var playState = {};
var Keys = {};
var speed = 5;

playState.init = function(){
    game.stage.disableVisibilityChange = true;
}

playState.create = function(){
    game.input.mouse.capture = true;
    this.alphaText = game.add.text(game.world.centerX, 10, 'Alpha Version 1.0', { fontSize: '16px', fill: '#000' });

    this.bg = game.add.tileSprite(0,0,1088,736, 'bg');
    //Create array of players
    this.playerMap = {};
    this.enemies = game.add.group();

    //ask the server to add a new play
    Client.askNewPlayer();
    Keys = {
        W     : game.input.keyboard.addKey(Phaser.Keyboard.W),
        A     : game.input.keyboard.addKey(Phaser.Keyboard.A),
        S     : game.input.keyboard.addKey(Phaser.Keyboard.S),
        D     : game.input.keyboard.addKey(Phaser.Keyboard.D),
        START : game.input.keyboard.addKey(Phaser.Keyboard.ENTER),
        SHIFT : game.input.keyboard.addKey(Phaser.Keyboard.SHIFT),
        FIRE  : game.input.activePointer.leftButton
    };

};

playState.update = function(){
    playState.playerMovement();
    playState.playerRot();
    if(Keys.FIRE.isDown){
      playState.sendFire();
    }

    if(Keys.START.downDuration(10)){
      Client.spawnEnemies();
    }
    playState.checkEnemies();
};

playState.checkEnemies = function(){
  if(this.enemies.countLiving() == 0){
    Client.showArrows();
  } else {
    Client.hideArrows();
  }
}

playState.spawnEnemy = function(data){
  // console.log(data.id + " (x: " + data.x + ", y: " + data.y + ")");
  var enemy = new Enemy(game, data.id, data.x, data.y, 'enemy');
  playState.enemies.add(enemy);
}

playState.addNewPlayer = function(id,x,y){
  if(id == 0)
    playState.playerMap[id] = new Player(game, id, x, y, 'p1');
  else if(id == 1)
    playState.playerMap[id] = new Player(game, id, x, y, 'p2');
  else if(id == 2)
    playState.playerMap[id] = new Player(game, id, x, y, 'p3');
  else if(id == 3)
    playState.playerMap[id] = new Player(game, id, x, y, 'p4');
  else {
    playState.playerMap[id] = new Player(game, id, x, y, 'p1');
  }
}

playState.sendFire = function(){
 Client.sendFire();
}

playState.playerFire = function(id, fire){
  playState.playerMap[id].playerFire(id, fire);
}

playState.shotHit = function(id, player, enemy){
  playState.playerMap[id].shotHit(player, enemy);
}

playState.showArrows = function(id){
  playState.playerMap[id].showArrows();
}

playState.hideArrows = function(id){
  playState.playerMap[id].hideArrows();
}

playState.mouseMove = function() {
    /* Added a check for if the shift key isDown as it might be an interesting
     * game mechanic to not be able to shoot and sprint at the same time.
     */
    if(game.input.mousePointer.isDown && Keys.SHIFT.isDown){
        Client.sendMouse(true);
    } else {
        Client.sendMouse(false);
    }
};

playState.movePlayerToMouse = function(id, mouse_drag) {
    playState.playerMap[id].movePlayerToMouse(id, mouse_drag);
};

playState.playerRot = function(){
    var x = game.input.mousePointer.position.x + game.camera.x;
    var y = game.input.mousePointer.position.y + game.camera.y;
    Client.sendRot(x, y);
};

playState.rotatePlayer = function(id, x, y){
  playState.playerMap[id].rotatePlayer(id, x, y);
}

playState.playerMovement = function() {
    direction = "stop";
    var num_pressed = 0;
    var key;
    for(key in Keys) {
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
            Client.sendUpdate(speed, direction);
        }
        speed = (num_pressed > 1) ? 1.5 : 2;
    }
}

playState.movePlayer = function(id, x, y, dir){
    playState.playerMap[id].movePlayer(id, x, y, dir);
};

playState.removePlayer = function(id){
    console.log("Deleted Player " + id);
    playState.playerMap[id].destroy();
    delete playState.playerMap[id];
};

playState.getRandNum = function(min, max){
    return Math.random() * (max - min) + min;
}

playState.render = function(){
  // playState.enemies.forEachAlive(playState.renderGroup, this)
  // game.debug.cameraInfo(game.camera, 32, 32);
}

playState.renderGroup = function(member){
  game.debug.body(member);
}

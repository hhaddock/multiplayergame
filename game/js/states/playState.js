var playState = {};
var Keys = {};

playState.init = function(){
    game.stage.disableVisibilityChange = true;
}

playState.create = function(){
    game.input.mouse.capture = true;

    this.bg = game.add.tileSprite(0,0,1088,736, 'bg');
    this.alphaText = game.add.text(10, 10, 'Alpha Version 1.0', { fontSize: '24px', fill: '#fff' });
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
        FIRE  : game.input.activePointer.leftButton,
        RELOAD: game.input.keyboard.addKey(Phaser.Keyboard.R)
    };
}

playState.update = function(){
    //Player Settings
    playState.playerMovement();
    playState.playerRot();
    playState.gunManager();

    //Enemy Settings
    playState.aiMovement();

    if(Keys.START.downDuration(10)){
      Client.spawnEnemies();
    }
}

playState.spawnEnemy = function(data){
  var enemy = new Enemy(game, data.id, data.x, data.y, 'enemy');
  playState.enemies.add(enemy);
}

playState.aiMovement = function(){
  Client.SendAiUpdate();
}

playState.moveAI = function(){
    playState.enemies.forEachAlive(function(enemy){
        console.log( playState.getClosestPlayer(enemy).x );
        game.physics.arcade.moveToObject(enemy, playState.getClosestPlayer(enemy), .2, 5000);
    });
}

playState.getClosestPlayer = function(enemy){
    var closestPlayer;
    var minDist = 0;
    console.log( playState.playerMap.length );
    for( id = 0; id < playState.playerMap.length; id++ ){
        var currentPlayer = playState.playerMap[ id ];
        var dX = Math.abs( currentPlayer.x - enemy.x );
        var dY = Math.abs( currentPlayer.y - enemy.y );
        var deltaDist = Math.sqrt( dX * dX + dY * dY );

        if( deltaDist < minDist ) {
            minDist = deltaDist;
            closestPlayer = currentPlayer;
        }
    }
    if( !currentPlayer ) {
        currentPlayer = playState.playerMap[ 0 ];
    }
    return currentPlayer;
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
  playState.playerMap[id].setUI(id);
}

playState.gunManager = function(){
  if(Keys.FIRE.isDown){
    Client.sendFire();
  }
  if(Keys.RELOAD.downDuration(15)){
    Client.sendReload();
  }
}
playState.playerFire = function(id, fire){
  playState.playerMap[id].playerFire(id, fire);
}

playState.playerReload = function(id){
  playState.playerMap[id].playerReload(id);
}

playState.shotHit = function(id, player, enemy){
  playState.playerMap[id].shotHit(player, enemy);
}

playState.playerMovement = function() {
    keysPressed = 0;
    //Up and Down Movement
    if(Keys.W.isDown){
      keysPressed++;
      direction = "up";
      Client.sendPlayerMovement(direction, keysPressed);
    } else if(Keys.S.isDown){
      keysPressed++;
      direction = "down";
      Client.sendPlayerMovement(direction, keysPressed);
    }
    //Left and right movement
    if(Keys.A.isDown){
      keysPressed++;
      direction = "left";
      Client.sendPlayerMovement(direction, keysPressed);
    } else if(Keys.D.isDown){
      keysPressed++;
      direction = "right";
      Client.sendPlayerMovement(direction, keysPressed);
    }
}

playState.playerRot = function(){
    var x = game.input.mousePointer.position.x + game.camera.x;
    var y = game.input.mousePointer.position.y + game.camera.y;
    Client.sendRot(x, y);
};

playState.movePlayer = function(id, x, y, dir, totalKeys){
    playState.playerMap[id].movePlayer(id, x, y, dir, totalKeys);
};

playState.rotatePlayer = function(id, x, y){
  playState.playerMap[id].rotatePlayer(id, x, y);
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

}

playState.renderGroup = function(member){
  game.debug.body(member);
}

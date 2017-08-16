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
    playState.playerMovement();
    playState.playerRot();
    playState.gunManager();

    if(Keys.START.downDuration(10)){
      Client.spawnEnemies();
    }
}

playState.spawnEnemy = function(data){
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

playState.playerRot = function(){
    var x = game.input.mousePointer.position.x + game.camera.x;
    var y = game.input.mousePointer.position.y + game.camera.y;
    Client.sendRot(x, y);
};

playState.movePlayer = function(id, x, y, dir){
    playState.playerMap[id].movePlayer(id, x, y, dir);
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

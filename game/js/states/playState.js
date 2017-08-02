var score = 0;
var lives = 3;
var level = 1;
var asteroids = 10;

var playState = {
  create:function(){
    this.scoreText = game.add.text(850, 16, 'Score: ' + score, { fontSize: '16px', fill: '#fff' });
    this.levelText = game.add.text(16, 16, 'Level: ' + level, { fontSize: '16px', fill: '#fff' });
    this.livesText = game.add.text(16, 32, 'Lives: ' + lives, { fontSize: '16px', fill: '#fff' });

    var block = game.add.sprite(280, 280, 'block');
    block.inputEnabled = true;
    block.input.enableDrag(true);
  },
  update:function(){
    this.collisions();


  },

  collisions:function(){
    // game.physics.arcade.overlap(this.player.bullets, this.asteroids, this.astKill, null, this);
    // game.physics.arcade.overlap(this.player, this.asteroids, this.playerKill, null, this);
  },


  debug:function(asteroid){

  },

  render:function(){
  }
}

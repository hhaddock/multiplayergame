var loadState = {
  preload:function(){
    game.load.image('block', 'assets/block.png');
  },
  create:function(){
    game.state.start('play');
  }
}

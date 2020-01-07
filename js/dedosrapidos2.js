const DedosRapidos = new Kanvas({
  
  element: 'kanvas',

  config: {
    fps: 60,
  },

  scene: {
    rain: []
  },

  actions: function(){
    setTimeout(function(){
      let drop;
      for (i=0; i<10000; i++){
        setTimeout(function(){
          drop = new KanvasRectangle(this, {
            width: 20,
            height: 20,
            top: 0,
            left: parseInt(Math.random() * 990)
          });
          this.options.scene.rain.push(drop);
          drop.tween('top', 600, 1500);
        }.bind(this), 100 * i);
      }
    }.bind(this), 100);
  },

});


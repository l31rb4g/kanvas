class Kanvas {

    constructor(options){
        this.options = options;

        if (typeof(options.element) === 'string'){
            this.options.element =  document.getElementById(options.element);
        }
        
        // Internal vars
        this.frames = 0;
        this.realFps = 0;

        // Canvas and context
        this.canvas = document.getElementById('kanvas');
        this.ctx = this.canvas.getContext('2d');

        // Initializing engine
        setInterval(this.render.bind(this), Math.ceil(1000 / this.options.config.fps));
        setInterval(this.tick.bind(this), 1000);

        // Actions
        this.options.actions.bind(this)();
    }

    // Main render
    render(){
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.beginPath();

      this.ctx.font = '16px Arial';

      this.ctx.fillText(this.realFps + ' fps', 5, 16);

      for (let obj in this.options.scene){
        let objs = [];
        if (typeof(this.options.scene[obj]) === 'object' && this.options.scene[obj] instanceof Array){
          objs = this.options.scene[obj];
        } else {
          objs.push(this.options.scene[obj]);
        }
        for (obj in objs){
          objs[obj].render();
        }
      }

      for (let obj in this.options.scene){
        let objs = [];
        if (typeof(this.options.scene[obj]) === 'object' && this.options.scene[obj] instanceof Array){
          objs = this.options.scene[obj];
        } else {
          objs.push(this.options.scene[obj]);
        }
        for (let obj in objs){
          for (let tween in objs[obj].pendingTween){
            if (objs[obj].pendingTween[tween].length > 0){
              let current = objs[obj].properties[tween];
              objs[obj].properties[tween] += objs[obj].pendingTween[tween][0];
              objs[obj].pendingTween[tween] = objs[obj].pendingTween[tween].slice(1);
            }
          }
        }
      }

      this.ctx.stroke();
      this.frames++;
    }

    // Tick
    tick(){
      this.realFps = this.frames;
      this.frames = 0;
    }
}

// Classes
KanvasRectangle = function(kanvas, options){
  this.kanvas = kanvas;
  this.pendingTween = {};
  this.properties = {
    left: 100,
    top: 100,
    width: 100,
    height: 100,
  }
  for (opt in options){
    this.properties[opt] = options[opt];
  }

  this.render = function(){
    this.kanvas.ctx.rect(
      this.properties.left,
      this.properties.top,
      this.properties.width,
      this.properties.height
    );
  }

  this.tween = function(property, target, duration){
    let _fps = this.kanvas.realFps;
    if (this.kanvas.realFps === 0) _fps = this.kanvas.options.config.fps;

    let res = [];
    let t;
    let frameDuration = _fps * (duration / 1000);
    for (i=0; i<frameDuration; i++){
      t = (target - this.properties[property]) / frameDuration;
      res.push(t);
    }
    this.pendingTween[property] = res;
  }
}

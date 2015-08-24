(function () {
  if (typeof SandGame === "undefined") {
    window.SandGame = {};
  }


  var Game = SandGame.Game = function () {
    this.particles = [];
    this.positions = {};
    this.particleOn = false;
    this.mouse_x = 300;
    this.mouse_y = 300;
  };

  Game.BG_COLOR = "#000000";
  Game.DIM_X = 1000;
  Game.DIM_Y = 600;
  Game.FPS = 32;

  Game.prototype.add = function (object) {
    this.particles.push(object);
    this.positions["" + object.x + "," + object.y] = object;
  };

  Game.prototype.draw = function (ctx) {
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    ctx.fillStyle = Game.BG_COLOR;
    ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

    this.particles.forEach(function (particle) {
      particle.draw(ctx);
    });
  };

  Game.prototype.moveObjects = function () {
    var parts = this.particles.sort(function(a,b){
      if (a.pos[1] > b.pos[1]){
        return -1;
      } else if (a.pos[1] < b.pos[1]){
        return 1;
      }
      return 0;
    })
    parts.forEach(function (particle) {
      particle.move();
    });
  };

  Game.prototype.step = function () {
    this.moveObjects();
    if (this.particleOn){
      this.makeParticle(this.mouse_x, this.mouse_y)
    }
  };

  Game.prototype.makeParticles = function (){
    this.particleOn = true;
  },

  Game.prototype.stopParticles = function (){
    this.particleOn = false;
  },

  Game.prototype.moveMouse = function(x,y){
    this.mouse_x = x;
    this.mouse_y = y;
  },

  Game.prototype.makeParticle = function (x,y){
    this.add(new SandGame.SandParticle({
     game: this,
     pos: [x + this.xPosOff(),y],
     vel: [this.xVelOff(),1],
     accel: [0,1],
     radius: 1,
     color: "#FFFFFF"
   }));
  };

  Game.prototype.xPosOff = function(){
    return Math.floor(Math.random() * 4) - 2;
  }

  Game.prototype.xVelOff = function(){
    return Math.floor(Math.random() * 2) - 1;
  }

  Game.prototype.betweenPos = function(currentPos, finalPos){
    //change this to work for horizontal movement
    result = []
    var x = currentPos[0];
    var y = currentPos[1];
    while (y < finalPos[1]){
      result.push([[x,y],[x,y+1]])
      y += 1
    }
    return result
  }

  Game.prototype.shouldStop = function (currentPos, finalPos){
    poss = this.betweenPos(currentPos, finalPos);
    var toReturn = null;
    var that = this;
    poss.forEach(function(pos){
      var inSpace = that.positions["" + pos[1][0] + "," + pos[1][1]]
      if (toReturn === null && inSpace !== undefined){
        toReturn = pos[0]
      }
    });
    return toReturn;
  }

})();

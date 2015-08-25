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
    this.solid = false;
  };

  Game.BG_COLOR = "#341934";
  Game.DIM_X = 1000;
  Game.DIM_Y = 600;
  Game.FPS = 120;

  Game.prototype.add = function (object) {
    this.particles.push(object);
    this.positions["" + object.pos[0] + "," + object.pos[1]] = object;
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

  Game.prototype.mouseDown = function (){
    if (!this.solid){
      this.makeParticles()
    } else {
      this.placeSolid = true;
    }
  },

  Game.prototype.mouseUp = function (){
    if (!this.solid){
      this.stopParticles()
    } else {
      this.placeSolid = false;
    }
  },

  Game.prototype.makeParticles = function (){
    this.particleOn = true;
  },

  Game.prototype.stopParticles = function (){
    this.particleOn = false;
  },

  Game.prototype.addSolid = function (x,y){
    var positions = [[x,y],[x,y+1],[x+1,y],[x+1,y+1]];

    var that = this;
    positions.forEach(function(position){
      that.add(new SandGame.SolidParticle({
        game: that,
        pos: position
      }));
    })
  },

  Game.prototype.moveMouse = function(x,y){
    this.mouse_x = x;
    this.mouse_y = y;
    if (this.solid && this.placeSolid){
      this.addSolid(x,y);
    };
  },

  Game.prototype.toggleSolid = function(){
    this.solid = !this.solid;
  },

  Game.prototype.toggleWater = function(){
    this.solid = false;
    this.water = !this.water
  },

  Game.prototype.addManyWater = function(n, x, y){
    for (var i = n; i >= 0; i--) {
      this.add(new SandGame.WaterParticle({
        game: this,
        pos: [x + this.xPosOff(),y],
        vel: [this.xVelOff(),1],
        accel: [0,1]
      }))
    };
  },

  Game.prototype.addManySand = function(n, x, y){
    for (var i = n; i >= 0; i--) {
      this.add(new SandGame.SandParticle({
        game: this,
        pos: [x + this.xPosOff(),y],
        vel: [this.xVelOff(),1],
        accel: [0,1]
      }))
    };
  },

  Game.prototype.makeParticle = function (x,y){
    if (this.water){
      this.addManyWater(8, x, y)
    } else {
      this.addManySand(8, x, y)
    }
  };

  Game.prototype.xPosOff = function(){
    return Math.floor(Math.random() * 8) - 4;
  }

  Game.prototype.xVelOff = function(){
    return Math.floor(Math.random() * 4) - 2;
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

(function () {
  if (typeof SandGame === "undefined") {
    window.SandGame = {};
  }


  var Game = SandGame.Game = function () {
    // this.particles = [];
    this.positions = {};
    this.particleOn = false;
    this.mouse_x = 300;
    this.mouse_y = 300;
    this.deletePenOn = false;
    this.placeStone = false;
    // ["delete", "water", "sand", "stone","cloud", "dirt", "seed"]
    this.mode = "sand"
  };

  Game.BG_COLOR = "#341934";
  Game.DIM_X = 1000;
  Game.DIM_Y = 600;
  Game.FPS = 120;

  Game.prototype.showSave = function (){
    var uncircularPositions = []
    var that = this;
    Object.keys(this.positions).forEach(function (key) {
      var particle = that.positions[key];
      var type = "stn";
      if (particle instanceof SandGame.WaterParticle) {
        type = "wtr";
      } else if (particle instanceof SandGame.StoneParticle){
        type = "snd";
      } else if (particle instanceof SandGame.CloudParticle){
        type = "cld";
      } else if (particle instanceof SandGame.DirtParticle){
        type = "drt";
      } else if (particle instanceof SandGame.SeedParticle){
        type = "sd";
      } else if (particle instanceof SandGame.Flower){
        type = "flr";
      }

      var options = {}
      Object.keys(particle).forEach(function (key) {
        if (key === "pos" || key === "vel" || key === "accel" || key === "inPile"){
          var val = JSON.parse(JSON.stringify(particle[key]));
          options[key] = val; 
        }
      })

      uncircularPositions.push([type, options])
    });
    var string = JSON.stringify(uncircularPositions);
    var win = window.open("", "Saved Game", width=400, height=400, top="+(screen.height-400)+", left="+(screen.width-840)");
    win.document.body.innerHTML = string;
  };

  Game.prototype.loadGame = function (){
    var string = prompt("Please enter your game string", "");
    if (string !== "" && string !== null) {
      var that = this;
      var uncircularPositions = JSON.parse(string);
      this.positions = {};
      uncircularPositions.forEach(function (particle){
        options = particle[1]
        options.game = that;
        if (particle[0] === "stn"){
          particleX = new SandGame.StoneParticle(options);
        } else if (particle[0] === "snd"){
          particleX = new SandGame.SandParticle(options);
        } else if (particle[0] == "wtr"){
          particleX = new SandGame.WaterParticle(options);
        } else if (particle[0] == "cld"){
          particleX = new SandGame.CloudParticle(options);
        } else if (particle[0] == "drt"){
          particleX = new SandGame.DirtParticle(options);
        } else if (particle[0] == "sd"){
          particleX = new SandGame.SeedParticle(options);
        } else if (particle[0] == "flr"){
          particleX = new SandGame.Flower(options);
        }
        console.log(particleX);
        that.add(particleX);
      });
    }
  }

  Game.prototype.add = function (object) {
    // this.particles.push(object);
    this.positions["" + object.pos[0] + "," + object.pos[1]] = object;
  };

  Game.prototype.draw = function (ctx) {
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    ctx.fillStyle = Game.BG_COLOR;
    ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

    var that = this;
    Object.keys(this.positions).forEach(function (key) {
      that.positions[key].draw(ctx)
      // particle.draw(ctx);
    });
  };

  Game.prototype.moveObjects = function () {
    var that = this;
    Object.keys(this.positions).forEach(function (key) {
      if (that.positions[key]){
        that.positions[key].move();
      }
    });
  };

  Game.prototype.step = function () {
    this.moveObjects();
    if (this.particleOn){
      this.makeParticle(this.mouse_x, this.mouse_y)
    }
  };

  Game.prototype.mouseDown = function (){
    if (this.deletePen){
      this.deletePenOn = true;
    } else if (this.mode !== "stone"){
      this.makeParticles()
    } else {
      this.placeStone = true;
    }
  },

  Game.prototype.mouseUp = function (){
    if (this.deletePen){
      this.deletePenOn = false;
    } else if (this.mode !== "stone"){
      this.stopParticles()
    } else {
      this.placeStone = false;
    }
  },

  Game.prototype.makeParticles = function (){
    this.particleOn = true;
  },

  Game.prototype.stopParticles = function (){
    this.particleOn = false;
  },

  Game.prototype.toggleMode = function (mode){
    this.mode = mode;
  },

  Game.prototype.addStone = function (x,y){
    var positions = [[x,y],[x,y+1],[x+1,y],[x+1,y+1]];

    var that = this;
    positions.forEach(function(position){
      that.add(new SandGame.StoneParticle({
        game: that,
        pos: position
      }));
    })
  },

  Game.prototype.moveMouse = function(x,y){
    this.mouse_x = x;
    this.mouse_y = y;
    if (this.mode === "stone" && this.placeStone){
      this.addStone(x,y);
    } else if (this.deletePen && this.deletePenOn){
      delete this.positions["" + x + "," + y];
      delete this.positions["" + x + "," + (y + 1)];
      delete this.positions["" + (x + 1) + "," + y];
      delete this.positions["" + (x + 1) + "," + (y + 1)];
    }
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

  Game.prototype.addManyCloud = function(n, x, y){
    for (var i = n; i >= 0; i--) {
      this.add(new SandGame.CloudParticle({
        game: this,
        pos: [x + this.xPosOff(),y],
        vel: [this.xVelOff(),-0.1],
        accel: [0,-0.05]
      }))
    };
  },

  Game.prototype.addManySand = function(n, x, y){
    for (var i = n; i >= 0; i--) {
      this.add(new SandGame.SandParticle({
        game: this,
        pos: [x + this.xPosOff(),y+this.xPosOff()],
        vel: [this.xVelOff(),this.xVelOff()],
        accel: [0,1]
      }))
    };
  },

  Game.prototype.addManyDirt = function(n, x, y){
    for (var i = n; i >= 0; i--) {
      this.add(new SandGame.DirtParticle({
        game: this,
        pos: [x + this.xPosOff(),y+this.xPosOff()],
        vel: [this.xVelOff(),this.xVelOff()],
        accel: [0,1]
      }))
    };
  },

  Game.prototype.makeParticle = function (x,y){
    if (this.mode === "water"){
      this.addManyWater(60, x, y)
    } else if (this.mode === "cloud"){
      this.addManyCloud(100, x, y)
    } else if (this.mode === "sand"){
      this.addManySand(60, x, y)
    } else if (this.mode === "dirt"){
      this.addManyDirt(60,x,y)
    } else if (this.mode === "seed"){
      this.add(new SandGame.SeedParticle({
        pos: [x,y],
        vel: [this.xVelOff(),this.xVelOff()],
        accel: [0,1],
        game: this
      }));
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

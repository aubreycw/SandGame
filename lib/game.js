(function () {
  if (typeof SandGame === "undefined") {
    window.SandGame = {};
  }


  var Game = SandGame.Game = function () {
    // this.particles = [];
    this.positions = {};
    // this.loadFromString(SandGame.seedData);
    this.particleOn = false;
    this.mouse_x = 300;
    this.mouse_y = 300;
    this.deletePenOn = false;
    this.placeStone = false;
    // ["delete", "water", "sand", "stone","cloud", "dirt", "seed"]
    this.mode = "sand"
  };

  Game.BG_COLOR = "#341934";
  // Game.DIM_X = 1000;
  // Game.DIM_Y = 600;
  Game.FPS = 120;

  Game.prototype.clearGame = function (){
    this.positions = {};
  }

  Game.prototype.loadFromString = function (string){
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
        } else if (particle[0] == "stk"){
          particleX = new SandGame.Stalk(options);
        }
        that.add(particleX);
      });
  }

  Game.prototype.showSave = function (){
    var uncircularPositions = []
    var that = this;
    Object.keys(this.positions).forEach(function (key) {
      var particle = that.positions[key];
      var type = "stn";
      if (particle instanceof SandGame.WaterParticle) {
        type = "wtr";
      } else if (particle instanceof SandGame.StoneParticle){
        type = "stn";
      } else if (particle instanceof SandGame.SandParticle){
        type = "snd";
      } else if (particle instanceof SandGame.CloudParticle){
        type = "cld";
      } else if (particle instanceof SandGame.DirtParticle){
        type = "drt";
      } else if (particle instanceof SandGame.SeedParticle){
        type = "sd";
      } else if (particle instanceof SandGame.Flower){
        type = "flr";
      } else if (particle instanceof SandGame.Stalk){
        type = "stk";
      }

      var options = {}
      Object.keys(particle).forEach(function (key) {
        if (key === "pos" || key === "vel" || key === "inPile"){
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
        } else if (particle[0] == "stk"){
          particleX = new SandGame.Stalk(options);
        }
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
    if (this.mode === "delete"){
      this.deletePenOn = true;
    } else if (this.mode !== "stone"){
      this.makeParticles()
    } else {
      this.placeStone = true;
    }
  },

  Game.prototype.mouseUp = function (){
    if (this.mode === "delete"){
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
    } else if (this.mode === "delete" && this.deletePenOn){
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
        pos: [x + this.xPosOff(),y + this.xPosOff()],
        vel: [this.xVelOff(),this.xVelOff()]
      }))
    };
  },

  Game.prototype.addManyWaterDown = function(n, x, y){
    var yy = y;
    for (var i = n; i >= 0; i--) {
      this.add(new SandGame.WaterParticle({
        game: this,
        pos: [x,yy],
        vel: [0,0]
      }))
      yy+=1
    };
  },

  Game.prototype.addManyCloud = function(n, x, y){
    for (var i = n; i >= 0; i--) {
      this.add(new SandGame.CloudParticle({
        game: this,
        pos: [x + this.xPosOff(),y + this.xPosOff()],
        vel: [this.xVelOff(),0]
      }))
    };
  },

  Game.prototype.addManySand = function(n, x, y){
    for (var i = n; i >= 0; i--) {
      this.add(new SandGame.SandParticle({
        game: this,
        pos: [x + this.xPosOff(),y+this.xPosOff()],
        vel: [this.xVelOff(),this.xVelOff()]
      }))
    };
  },

  Game.prototype.addManyDirt = function(n, x, y){
    for (var i = n; i >= 0; i--) {
      this.add(new SandGame.DirtParticle({
        game: this,
        pos: [x + this.xPosOff(),y+this.xPosOff()],
        vel: [this.xVelOff(),this.xVelOff()]
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
    // if (currentPos[0] === finalPos[0]){
      result = [];
      var x = currentPos[0];
      var y = currentPos[1];
      while (y < finalPos[1]){
        result.push([[x,y],[x,y+1]]);
        y += 1;
      }
      return result
    // } else if (currentPos[1] === finalPos[1]){
    //   result = [];
    //   var x = currentPos[0];
    //   var y = currentPos[1];
    //   while (y < finalPos[1]){
    //     result.push([[x,y],[x,y+1]]);
    //     y += 1;
    //   }
    //   return result;
    // }


    // var x0 = currentPos[0];
    // var x1 = finalPos[0];
    // var y0 = currentPos[1];
    // var y1 = finalPos[1];

    // if (x0 > x1 || y1 > y0){
    //   return [];
    // }

    // var dx = x1 - x0;
    // var dy = y1 - y0;

    // var D = 2*dy - dx
    // var points = [[x0,y0]];

    // var y = y0 + 0
    // for (var x = x0 + 1; x <= x1; x++) {
    //   if (D > 0){
    //     y += 1
    //     points.push([x,y]);
    //     D += (2*dy - 2*dx);
    //   } else {
    //     points.push([x,y]);
    //     D += 2*dy;
    //   }
    // };

    // var result = []
    // for (var i = 0; i < points.length - 1; i++) {
    //   result.push([points[i], points[i+1]]);
    // };
    // return result;
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

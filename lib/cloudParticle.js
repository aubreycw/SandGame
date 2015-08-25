(function () {
  if (typeof SandGame === "undefined") {
    window.SandGame = {};
  }
  var CloudParticle = SandGame.CloudParticle = function (options) {
    this.pos = options.pos;
    this.vel = options.vel;
    this.accel = [0,-0.05];
    this.color = "#5B6270";
    this.game = options.game;
    this.inPile = false;
    this.density = 1;
  };

  SandGame.Util.inherits(CloudParticle, SandGame.MovingParticle);

  CloudParticle.prototype.maybeCondense = function(){
    var touching = [[0,1],[0,-1],[1,1],[1,0],[1,-1],[-1,1],[-1,0],[-1,-1]];
    for (var i = touching.length - 1; i >= 0; i--) {
      becomeWater = [this];
      var posCloud = this.game.positions["" + (this.pos[0]+touching[i][0]) + "," + (this.pos[1]+touching[i][1])];
      if (posCloud instanceof CloudParticle){
        becomeWater.push(posCloud);
      };
    };
    if (becomeWater.length > 1){
      this.game.addManyWater(Math.floor(becomeWater.length/2), this.pos[0], this.pos[1]);
      return true;
    }
    return false;
  }

  CloudParticle.prototype.move = function () {
    if (!this.maybeCondense()){
      if (this.inPile){
        this.pileMove();
        return;
      }
      this.fall();
    }
  },

  CloudParticle.prototype.pileMove = function(){
    if (this.game.positions["" + this.pos[0] + "," + (this.pos[1] - 1)] === undefined && this.pos[1] > 0){
      this.inPile = false;
      this.vel = [0,-1];
      this.accel = [0,-1];
      this.fall();
      return;
    }


    rightPos = [this.pos[0] + 1, this.pos[1]]
    leftPos = [this.pos[0] - 1, this.pos[1]]

    rightVal = "" + rightPos[0] + "," + rightPos[1];
    leftVal = "" + leftPos[0] + "," + rightPos[1];

    var rightFirst = Math.random() < 0.5

    if (rightFirst && this.game.positions[rightVal] === undefined){
      delete this.game.positions["" + this.pos[0] + "," + this.pos[1]]
      this.pos = rightPos;
      this.game.positions[rightVal] = this;
    } else if (this.game.positions[leftVal] === undefined){
      delete this.game.positions["" + this.pos[0] + "," + this.pos[1]]
      this.pos = leftPos;
      this.game.positions[leftVal] = this;
    } else if (!rightFirst && this.game.positions[rightVal] === undefined){
      delete this.game.positions["" + this.pos[0] + "," + this.pos[1]]
      this.pos = rightPos;
      this.game.positions[rightPos] = this;
    }
  };

    CloudParticle.prototype.betweenPos = function(currentPos, finalPos){
      //change this to work for horizontal movement
      result = []
      var x = currentPos[0];
      var y = currentPos[1];
      while (y > finalPos[1]){
        result.push([[x,y],[x,y-1]])
        y -= 1
      }
      return result
  }

    CloudParticle.prototype.shouldStop = function (currentPos, finalPos){
      poss = this.betweenPos(currentPos, finalPos);
      var toReturn = null;
      var that = this.game;
      poss.forEach(function(pos){
        var inSpace = that.positions["" + pos[1][0] + "," + pos[1][1]]
        if (toReturn === null && inSpace !== undefined){
          toReturn = [pos[0][0], Math.floor(pos[0][1])]
        }
      });
    return toReturn;
  }


    CloudParticle.prototype.fall = function () {
      delete this.game.positions["" + this.pos[0] + "," + this.pos[1]]
      this.vel = [this.vel[0] + this.accel[0], this.vel[1] + this.accel[1]];
      var finalPos = [this.pos[0] + this.vel[0], this.pos[1] + this.vel[1]];
      var stopWhere = this.shouldStop(this.pos, finalPos)
      if (stopWhere !== null){
        // debugger;
        this.vel = [0,0];
        this.accel = [0,0];
        this.pos = stopWhere
        this.game.positions["" + this.pos[0] + "," + this.pos[1]] = this
        this.inPile = true;
        return this;
      }
      this.pos = [this.pos[0] + this.vel[0], this.pos[1] + this.vel[1]];

      if (this.pos[1] <= 0){
        // debugger;
        this.pos[1] = 0;
        this.vel = [0,0];
        this.accel = [0,0];
        this.inPile = true;
      }
      if (this.pos[0] >= 1000){
        this.pos[0] = 1000;
        this.vel = [0,0];
        this.accel = [0,0];
      }
      if (this.pos[0] <= 0){
        this.pos[0] = 0;
        this.vel = [0,0];
        this.accel = [0,0];
      }
      this.game.positions["" + this.pos[0] + "," + this.pos[1]] = this
  };


})();
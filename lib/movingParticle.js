(function () {
  if (typeof SandGame === "undefined") {
    window.SandGame = {};
  }


  var MovingParticle = SandGame.MovingParticle = function (options) {
  };


  MovingParticle.prototype.draw = function (ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.pos[0], this.pos[1], 1, 1);
    ctx.fill();
  };

  MovingParticle.prototype.move = function () {
    if (this.inPile){
      this.pileMove();
      return;
    }
    this.fall();
  },

  MovingParticle.prototype.pileMove = function(){
    if (this.pos[1] === 600 || this.pos[0] === 0 || this.pos[0] === 1000){
      return;
    }

    var beneath = this.game.positions["" + this.pos[0] + "," + (this.pos[1] + 1)]
    if ( beneath === undefined){
      this.inPile = false;
      this.accel = [0,1];
      this.fall();

      return;
    }

    if (beneath.density < this.density){
      holder = beneath.pos;
      beneath.pos = this.pos;
      this.pos = holder;
      this.game.positions["" + this.pos[0] + "," + (this.pos[1])] = this;
      this.game.positions["" + beneath.pos[0] + "," + (beneath.pos[1])] = beneath;

    }


    downRightPos = [this.pos[0] + 1, this.pos[1] + 1]
    downLeftPos = [this.pos[0] - 1, this.pos[1] + 1]

    downRight = "" + downRightPos[0] + "," + downRightPos[1];
    downLeft = "" + downLeftPos[0] + "," + downLeftPos[1];
    belowDownRight = "" + downRightPos[0] + "," + downRightPos[1]+1;
    belowDownLeft = "" + downLeftPos[0] + "," + downLeftPos[1]+1;

    if (this.game.positions[downRight] === undefined){
      delete this.game.positions["" + this.pos[0] + "," + this.pos[1]]
      this.pos = downRightPos;
      this.game.positions[downRight] = this;
    } else if (this.game.positions[downLeft] === undefined){
      delete this.game.positions["" + this.pos[0] + "," + this.pos[1]]
      this.pos = downLeftPos;
      this.game.positions[downLeft] = this;
    }
  },

  //refactor to moving particle
  MovingParticle.prototype.fall = function () {
    delete this.game.positions["" + this.pos[0] + "," + this.pos[1]]
    this.vel = [this.vel[0] + this.accel[0], this.vel[1] + this.accel[1]];
    var finalPos = [this.pos[0] + this.vel[0], this.pos[1] + this.vel[1]];
    var stopWhere = this.game.shouldStop(this.pos, finalPos)
    if (stopWhere !== null){
      this.vel = [0,0];
      this.accel = [0,0];
      this.pos = stopWhere
      this.game.positions["" + this.pos[0] + "," + this.pos[1]] = this
      this.inPile = true;
      return this;
    }
    this.pos = [this.pos[0] + this.vel[0], this.pos[1] + this.vel[1]];

    if (this.pos[1] >= 600){
      this.pos[1] = 600;
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
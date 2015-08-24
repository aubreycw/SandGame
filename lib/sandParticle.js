(function () {
  if (typeof SandGame === "undefined") {
    window.SandGame = {};
  }


  var SandParticle = SandGame.SandParticle = function (options) {
    this.pos = options.pos;
    this.vel = options.vel;
    this.accel = options.accel;
    this.radius = options.radius;
    this.color = options.color;
    this.game = options.game;
    this.inPile = false;
  };

  SandParticle.prototype.draw = function (ctx) {
    ctx.fillStyle = this.color;

    ctx.beginPath();
    ctx.arc(
      this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
    );
    ctx.fill();
  };

  SandParticle.prototype.move = function () {
    if (this.inPile){
      this.pileMove();
      return;
    }
    this.fall();
  },

  SandParticle.prototype.pileMove = function(){
    if (this.pos[1] === 600 || this.pos[0] === 0 || this.pos[0] === 1000){
      return;
    }

    if (this.game.positions["" + this.pos[0] + "," + (this.pos[1] + 1)] === undefined){
      this.inPile = false;
      this.fall();
      return;
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

  SandParticle.prototype.fall = function () {
    delete this.game.positions["" + this.pos[0] + "," + this.pos[1]]
    this.vel = [this.vel[0] + this.accel[0], this.vel[1] + this.accel[1]];
    var finalPos = [this.pos[0] + this.vel[0], this.pos[1] + this.vel[1]];
    var stopWhere = this.game.shouldStop(this.pos, finalPos)
    if (stopWhere !== null){
      // var velx = 0
      // var vely = 0
      // var accelx = 0
      // var accely = 0

      // if (stopWhere[0] === this.pos[0]){
      //   velx = this.vel[0];
      //   accelx = this.accel[0];
      // }
      // if (stopWhere[1] === this.pos[1]){
      //   vely = this.vel[1];
      //   accely = this.accel[1];
      // }
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

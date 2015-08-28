(function () {
  if (typeof SandGame === "undefined") {
    window.SandGame = {};
  }


  var CustomParticle = SandGame.CustomParticle = function (options) {
    this.pos = options.pos;
    this.vel = options.vel;
    this.accel = options.accel,
    this.defaultAccel = options.accel,
    this.color = options.color;
    this.game = options.game;
    this.inPile = false;
    this.density = options.density;
    this.slope = options.slopw
  };

  SandGame.Util.inherits(CustomParticle, SandGame.MovingParticle);

  CustomParticle.prototype.pileMove = function(){
    if (this.pos[1] === SandGame.Game.DIM_Y || this.pos[0] === 0 || this.pos[0] === SandGame.Game.DIM_X){
      return;
    }


    var beneath = this.game.positions["" + this.pos[0] + "," + (this.pos[1] + 1)]
    if ( beneath === undefined){
      this.inPile = false;
      this.accel = this.defaultAccel;
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
  };

})();

(function () {
  if (typeof SandGame === "undefined") {
    window.SandGame = {};
  }
  var WaterParticle = SandGame.WaterParticle = function (options) {
    this.pos = options.pos;
    this.vel = options.vel;
    this.accel = options.accel;
    this.color = "#00B2B2";
    this.game = options.game;
    this.inPile = false;
    this.density = 1;
  };

  SandGame.Util.inherits(WaterParticle, SandGame.MovingParticle);

  WaterParticle.prototype.pileMove = function(){
    if (this.game.positions["" + this.pos[0] + "," + (this.pos[1] + 1)] === undefined){
      this.inPile = false;
      this.vel = [0,1];
      this.accel = [0,1];
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
  }


})();
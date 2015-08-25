(function () {
  if (typeof SandGame === "undefined") {
    window.SandGame = {};
  }
  var WaterParticle = SandGame.WaterParticle = function (options) {
    this.pos = options.pos;
    this.vel = options.vel;
    this.accel = [0,1];
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
      if (beneath instanceof SandGame.Flower){
        var stalk = new SandGame.Stalk({pos: holder, game:this.game})
        this.game.add(stalk);
        this.game.positions["" + stalk.pos[0] + "," + (stalk.pos[1])] = stalk;
        this.game.positions["" + beneath.pos[0] + "," + (beneath.pos[1])] = beneath;
      } else {
        this.pos = holder;
        this.game.positions["" + this.pos[0] + "," + (this.pos[1])] = this;
        this.game.positions["" + beneath.pos[0] + "," + (beneath.pos[1])] = beneath;
      }
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
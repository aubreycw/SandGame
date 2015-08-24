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
    delete this.game.positions["" + this.pos[0] + "," + this.pos[1]]

    // change this to general movement
    this.vel = [this.vel[0] + this.accel[0], this.vel[1] + this.accel[1]];
    var finalPos = [this.pos[0] + this.vel[0], this.pos[1] + this.vel[1]];
    var stopWhere = this.game.shouldStop(this.pos, finalPos)
    if (stopWhere !== null){
      //change this to only stop movement in correct direction
      this.vel = [0,0];
      this.accel = [0,0];
      this.pos = stopWhere
      this.game.positions["" + this.pos[0] + "," + this.pos[1]] = this
      return this;
    }
    this.pos = [this.pos[0] + this.vel[0], this.pos[1] + this.vel[1]];

    if (this.pos[1] >= 600){
      this.pos[1] = 600;
      this.vel[1] = 0;
      this.accel[1] = 0;
    }
    if (this.pos[0] >= 1000){
      this.pos[0] = 1000;
      this.vel[0] = 0;
      this.accel[0] = 0;
    }
    if (this.pos[0] <= 0){
      this.pos[0] = 0;
      this.vel[0] = 0;
      this.accel[0] = 0;
    }
    this.game.positions["" + this.pos[0] + "," + this.pos[1]] = this
  };

})();

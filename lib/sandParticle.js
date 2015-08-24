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
    this.vel = [this.vel[0] + this.accel[0], this.vel[1] + this.accel[1]];
    this.pos = [this.pos[0] + this.vel[0], this.pos[1] + this.vel[1]];
  };

})();

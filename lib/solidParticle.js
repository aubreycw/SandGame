(function () {
  if (typeof SandGame === "undefined") {
    window.SandGame = {};
  }

  var SolidParticle = SandGame.SolidParticle = function (options) {
    this.pos = options.pos;
    this.color = options.color;
    this.game = options.game;
  };

  SolidParticle.prototype.draw = function (ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.pos[0], this.pos[1], 2, 2);
    ctx.fill();
  };

  SolidParticle.prototype.move = function () {
  };

})();
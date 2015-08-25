(function () {
  if (typeof SandGame === "undefined") {
    window.SandGame = {};
  }

  var StoneParticle = SandGame.StoneParticle = function (options) {
    this.pos = options.pos;
    this.color = "#70705C";
    this.game = options.game;
  };

  StoneParticle.prototype.draw = function (ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.pos[0], this.pos[1], 2, 2);
    ctx.fill();
  };

  StoneParticle.prototype.move = function () {
  };

})();
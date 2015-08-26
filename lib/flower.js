(function () {
  if (typeof SandGame === "undefined") {
    window.SandGame = {};
  }


  var Flower = SandGame.Flower = function (options) {
    this.pos = options.pos;
    this.game = options.game;
    this.vel = [0,0]
    this.accel = [(Math.random() - 0.5)*0.1,0.01];
    this.density = 0.5;
  };

  SandGame.Util.inherits(Flower, SandGame.MovingParticle);

  Flower.prototype.draw = function (ctx) {
    ctx.fillStyle = "#6C1943";
    ctx.fillRect(this.pos[0], this.pos[1], 3, 3);
    ctx.fill();

    ctx.fillStyle = "#FFCCFF";
    ctx.fillRect(this.pos[0], this.pos[1]+3, 3, 3);
    ctx.fillRect(this.pos[0], this.pos[1]-3, 3, 3);
    ctx.fillRect(this.pos[0]-3, this.pos[1], 3, 3);
    ctx.fillRect(this.pos[0]+3, this.pos[1], 3, 3);
    ctx.fill();

  };

})();
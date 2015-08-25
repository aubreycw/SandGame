(function () {
  if (typeof SandGame === "undefined") {
    window.SandGame = {};
  }


  var Flower = SandGame.Flower = function (options) {
    this.pos = options.pos;
    this.game = options.game;
    this.density = 1;
  };

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

  Flower.prototype.move = function () {
  };


})();
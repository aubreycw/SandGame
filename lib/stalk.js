(function () {
  if (typeof SandGame === "undefined") {
    window.SandGame = {};
  }


  var Stalk = SandGame.Stalk = function (options) {
    this.pos = options.pos;
    this.game = options.game;
    this.density = 0.5;
  };

  Stalk.prototype.draw = function (ctx) {
    ctx.fillStyle = "#00CC00";
    ctx.fillRect(this.pos[0], this.pos[1], 1, 1);
    ctx.fill();
  };

  Stalk.prototype.move = function () {
  };


})();
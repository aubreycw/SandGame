(function () {
  if (typeof SandGame === "undefined") {
    window.SandGame = {};
  }


  var Game = SandGame.Game = function () {
    this.particles = [];
    this.positions = {};
  };

  Game.BG_COLOR = "#000000";
  Game.DIM_X = 1000;
  Game.DIM_Y = 600;
  Game.FPS = 32;

  Game.prototype.add = function (object) {
    this.particles.push(object);
    this.positions["" + object.x + "," + object.y] = object;
  };

  Game.prototype.draw = function (ctx) {
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    ctx.fillStyle = Game.BG_COLOR;
    ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

    this.particles.forEach(function (particle) {
      particle.draw(ctx);
    });
  };

  Game.prototype.moveObjects = function () {
    this.particles.forEach(function (particle) {
      particle.move();
    });
  };

  Game.prototype.step = function () {
    this.moveObjects();
  };

  Game.prototype.makeParticle = function (x,y){
    this.add(new SandGame.SandParticle({
     game: this,
     pos: [x,y],
     vel: [0,0],
     accel: [0,1],
     radius: 5,
     color: "#FFFFFF"
   }));
  };

})();

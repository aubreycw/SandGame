(function () {

  if (typeof SandGame === "undefined") {
    window.SandGame = {};
  }


  var GameView = SandGame.GameView = function (game, ctx) {
    this.ctx = ctx;
    this.game = game;
    this.timerId = null;
  };

  GameView.prototype.start = function () {
    var gameView = this;
    this.timerId = setInterval(
      function () {
        gameView.game.step();
        gameView.game.draw(gameView.ctx);
      }, 100
    );
  };

  GameView.prototype.stop = function () {
    clearInterval(this.timerId);
  };


})();

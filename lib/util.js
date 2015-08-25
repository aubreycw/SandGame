(function () {
  if (typeof SandGame === "undefined") {
    window.SandGame = {};
  }

  var Util = SandGame.Util = {};

  var inherits = Util.inherits = function (ChildClass, BaseClass) {
    function Surrogate () { this.constructor = ChildClass };
    Surrogate.prototype = BaseClass.prototype;
    ChildClass.prototype = new Surrogate();
  };
})();
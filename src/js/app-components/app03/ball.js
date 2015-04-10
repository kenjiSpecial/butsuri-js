var BaseBall = require("../../components/ball");

var Ball = function(_mass, _rad, _pos, _vel){
    BaseBall.call(this, _mass, _rad, _pos, _vel );

    this.br = _rad;
    this.angularVel = -2*Math.PI + Math.random() * Math.PI;
};

Ball.prototype = Object.create(BaseBall.prototype);
Ball.prototype.constructor = Ball;

Ball.prototype.draw = function(ctx) {
  BaseBall.prototype.draw.call(this, ctx);

  var string = "" + parseInt(this.pos.x) + " " + parseInt(this.pos.y) + ""
  ctx.save();
  ctx.textAlign="center";
  ctx.font=this.fontSize + 'px  "Roboto"';
  ctx.fillStyle = "#000";

  ctx.translate(this.pos.x, this.pos.y);
  ctx.rotate(this.angle);

  ctx.fillText(string, 0, 0);

  ctx.restore();
};

Object.defineProperty(Ball.prototype, "br", {
  get : function() {
    return this._br;
  },

  set : function(val) {
    this._br = val;
    this.rad = val;
    this.fontSize = parseInt(1/3 * val);
  }
});


module.exports = Ball;

var Vector2 = require('ks-vector').Vector2;
var Rectangle = require('./rectangle.js');

var Box = function( mass, x, y, wid, hig ) {
    Rectangle.call(this, mass, x, y, wid, hig);

    this.halfWidth = this.width/2;
    this.halfHeight = this.height/2;
};

Box.prototype = Object.create(Rectangle.prototype);
Box.prototype.constructor = Box;

Box.prototype.update = function(dt) {
  console.log('update');
  // body...
  Rectangle.prototype.setGravity.call(this);
  Rectangle.prototype.update.call(this, dt);
}

Box.prototype.draw = function(ctx) {
  ctx.save();

  ctx.strokeStyle = "#000000";

  ctx.translate(this.pos.x, this.pos.y);
  ctx.rotate(this.theta);

  ctx.beginPath();
  ctx.strokeRect(-this.halfWidth, -this.halfHeight, this.width, this.height);

  ctx.beginPath();
  ctx.moveTo( -this.halfWidth, -this.halfHeight)
  ctx.lineTo(  this.halfWidth,  this.halfHeight );
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(  this.halfWidth, -this.halfHeight );
  ctx.lineTo( -this.halfWidth,  this.halfHeight );
  ctx.stroke();

  ctx.restore();
}

module.exports = Box;

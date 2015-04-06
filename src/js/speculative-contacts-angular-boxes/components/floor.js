var Vector2 = require('ks-vector').Vector2;
var Rectangle = require('./rectangle.js');

var Floor = function( x, y, wid, hig){
    Rectangle.call(this, 0, x, y, wid, hig);
    this.time = 0;
};

Floor.prototype = Object.create(Rectangle.prototype);
Floor.prototype.constructor = Floor;

Floor.prototype.loopMovement = function(dt) {
  this.time += dt;

  this.pos.x = window.innerWidth/2 + 200 * Math.sin(this.time/2);
}



module.exports = Floor;

var BaseRectangle = require("../../components/rectangle.js");
var Vector2   = require('ks-vector').Vector2;

var Rectangle = function(mass, x, y, wid, hig){
	BaseRectangle.call(this, mass, x, y, wid, hig);
};

Rectangle.prototype = Object.create(BaseRectangle.prototype);
Rectangle.prototype.constructor = Rectangle;

module.exports = Rectangle;

var BaseBall = require('../../components/ball.js');
var Vector2   = require('ks-vector').Vector2;

var Ball = function( _mass, _rad, _pos, _vel, imageData, frames ) {
	this.imageData = imageData;
	this.frames = frames;

	BaseBall.call(this, _mass, _rad, _pos, _vel );

	this.col = {r: 255, g: 255, b: 255};
}

Ball.prototype = Object.create(BaseBall.prototype);
Ball.prototype.constructor = BaseBall;

Ball.prototype.draw = function(ctx) {
	var xPos = parseInt( (this.pos.x - this.frames.frameLeftMargin) / this.frames.frameSize * this.imageData.width );
	var yPos = parseInt( (this.pos.y - this.frames.frameTopMargin) / this.frames.frameSize * this.imageData.width );

	var imagePos = 4 * (yPos * this.imageData.width + xPos);

	var colR = this.imageData.data[imagePos + 0];
	var colG = this.imageData.data[imagePos + 1];
	var colB = this.imageData.data[imagePos + 2];


	this.col.r += (colR - this.col.r) * .1;
	this.col.g += (colG - this.col.g) * .1;
	this.col.b += (colB - this.col.b) * .1;

	ctx.save();

	ctx.translate(this.pos.x, this.pos.y);
	ctx.rotate(this.angle);


	ctx.fillStyle = "rgb(" + parseInt(this.col.r) + "," + parseInt(this.col.g) + "," + parseInt(this.col.b) + ")";
	ctx.beginPath();
	ctx.arc( 0, 0, this.rad, 0, 2 * Math.PI);
	ctx.fill();

	ctx.restore();
}

var size = 30;
var Balls = function( mObjects, frames, imageData ) {
	var frameSize = frames.frameSize;

	var rowNum = parseInt(frameSize / size) ;

	for(var yy = 0; yy < rowNum; yy++){
		for (var xx = 0; xx < rowNum; xx++) {
			var rad = parseInt(size * (Math.random() * .8 + .6))/2;
			var margin = (size/2 - rad);
			var xPos = (xx + .5) * size + margin * (Math.random() - .5) * 2 + frames.frameLeftMargin
			var yPos = (yy + .5) * size + margin * (Math.random() - .5) * 2 + frames.frameTopMargin;
			var ball = new Ball( 1, rad, new Vector2(xPos, yPos), new Vector2(0, 0), imageData, frames );

			mObjects.push(ball);
		}
	}

}

module.exports = Balls;

var Line = require('../../components/line.js');

var Frame = function(mObject) {
	var minWindowSize = Math.min(window.innerWidth, window.innerHeight);
	this.frameSize = minWindowSize * .8;
	this.frameTopMargin = (window.innerHeight - this.frameSize)/2;
	this.frameLeftMargin = (window.innerWidth - this.frameSize)/2;

	var line0 = new Line(this.frameLeftMargin, this.frameTopMargin, this.frameLeftMargin, this.frameTopMargin + this.frameSize);
	var line1 = new Line(this.frameLeftMargin, this.frameTopMargin + this.frameSize, this.frameLeftMargin + this.frameSize, this.frameTopMargin + this.frameSize);
	var line2 = new Line(this.frameLeftMargin + this.frameSize, this.frameTopMargin, this.frameLeftMargin + this.frameSize, this.frameTopMargin + this.frameSize);
	var line3 = new Line(this.frameLeftMargin, this.frameTopMargin, this.frameLeftMargin + this.frameSize, this.frameTopMargin);

	line0.isDraw = false;
	line1.isDraw = false;
	line2.isDraw = false;
	line3.isDraw = false;

	mObject.push(line0);
	mObject.push(line1);
	mObject.push(line2);
	mObject.push(line3);


}

module.exports = Frame;

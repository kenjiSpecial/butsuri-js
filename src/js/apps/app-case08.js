
var TweenLite = require('gsap');
var AABB      = require('../components/aabb.js');
var CONSTANTS = require('../components/constants.js');
var solver    = require('../components/solver.js');

var Box  = require('../app-components/app08/box.js');
var Ball = require('../components/ball.js');
var Plane = require('../components/plane.js');

var Vector2 = require('ks-vector').Vector2;
var cw, ch;
var scale = 1;
var count = 1;
var width = window.innerWidth/2;

var App = function() {
	this.loop = this.loop.bind(this);


	this.canvas = document.getElementById('c');
	cw = window.innerWidth;
	ch = window.innerHeight;
	this.canvas.width = cw;
	this.canvas.height = ch;

	this.ctx = this.canvas.getContext('2d');

	this.mObjects = [];
	this.ballArr  = [];

	var box = new Box(1, 0, 300, 100, 100);
	this.mObjects.push(box);

	var rad = 30;
	var ball = new Ball(10, 30, new Vector2( 100, -rad), new Vector2(0, 0));
	ball.num = this.ballArr.length;
	this.ballArr.push(ball)
	this.mObjects.push(ball);

	this.scale = 1;


	var plane = new Plane(width/2, window.innerHeight+1, width);
	this.mObjects.push(plane);

	setTimeout(this.loop, 1000);
}

App.prototype.loop = function() {
	var rad = parseInt(10 + Math.random() * 40)
	var ball = new Ball(10, rad, new Vector2( 100, -rad), new Vector2(0, 0));
	ball.num = this.ballArr.length;
  this.ballArr.push(ball);
	this.mObjects.push(ball);


	setTimeout(this.loop, 1000);
};

App.prototype.render = function() {
	var dt = CONSTANTS.timeStep;
	// ---------------
  this.generateMotionBounds(dt);
  // ---------------

  this.contacts = this.collide();
  solver(this.contacts);

  for(var ii in this.mObjects){
    if(this.mObjects[ii]) this.mObjects[ii].update(dt);
  }


	var posArr = [];
	for(var ii = 0; ii < count; ii++){
		posArr[ii] = 0;
	}

	for(var ii in this.ballArr){
		var ball = this.ballArr[ii];
		if(ball){
			var pos = parseInt(ball.pos.y / window.innerHeight);
			if(pos < 0) pos = 0;
			posArr[pos] = posArr[pos] + 1;
		}
	}

	// -------------------------
	//  draw
	// -------------------------
	this.ctx.save();
	this.ctx.scale(this.scale, this.scale)

	this.ctx.fillStyle = "#ffffff";
	this.ctx.fillRect(0, 0, window.innerWidth / this.scale, window.innerHeight / this.scale);


	for(var ii in this.mObjects){
		if(this.mObjects[ii]) this.mObjects[ii].draw(this.ctx);
	}

	this.ctx.textAlign="end";

  this.ctx.font= window.innerHeight + 'px  "Roboto"';
  this.ctx.fillStyle = "#000";

  // this.ctx.translate(this.pos.x, this.pos.y);

	for(var ii = 0; ii < posArr.length; ii++){
		this.ctx.fillText(posArr[ii], window.innerWidth / this.scale, window.innerHeight * (ii+1));
	}


	this.ctx.restore();

	var ballPosY = 0;
	for(var ii = 0; ii < this.ballArr.length; ii++){
		var ball = this.ballArr[ii];
		if(ball){
			ballPosY = Math.max(ballPosY, ball.pos.y);
			var posX = ball.pos.x;
			var rad = ball.rad;
			if(posX < -ball.rad || posX > window.innerWidth * count + rad){
				var num = ball.num;
				this.ballArr[num] = null;
			}





		}
	}
	if(count >  3){


	}else{
		if(ballPosY > window.innerHeight * count) this.scaleDown();
	}





};


App.prototype.scaleDown = function() {

  count++;
	TweenLite.to(this,2, {scale: 1/count, ease: Expo.easeOut});


	var box = new Box(1, width * (count - 1 )+ 100, 100 + window.innerHeight * (count - 1), 100, 100);
	this.mObjects.push(box);

	var box = new Box(1, width * (count - 1 + 1 )- 100,  window.innerHeight * (count - 1 + 1) - 350, 100, 100);
	this.mObjects.push(box);

	var plane = new Plane(width/2 * count, window.innerHeight*count, width * count);
	this.mObjects.push(plane);

	//this.ball = new Ball(10, 30, new Vector2( 100, 0), new Vector2(0, 0));
	//this.mObjects.push(this.ball);
}

App.prototype.generateMotionBounds = function(dt) {
  for(var ii in this.mObjects){
    if(this.mObjects[ii]) this.mObjects[ii].generateMotionAABB(dt);
  }
};

App.prototype.collide = function() {
  var contacts = [];

  for (var ii = 0; ii < this.mObjects.length - 1; ii++) {
    var rigidBodyA = this.mObjects[ii];
    for(var jj = ii + 1; jj < this.mObjects.length; jj++){
      var rigidBodyB = this.mObjects[jj];

				if(rigidBodyA && rigidBodyB){
		      if( rigidBodyA.mass != 0 || rigidBodyB.mass != 0 ){
		        if(AABB.overlap(rigidBodyA.motionBounds, rigidBodyB.motionBounds)){
		            var _contacts = rigidBodyA.getClosestPoints(rigidBodyB);
		            contacts = contacts.concat(_contacts);
		        }
		      }
			}
    }
  }

  return contacts;
}

module.exports = App;

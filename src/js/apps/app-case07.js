
var AABB      = require('../components/aabb.js');
var CONSTANTS = require('../components/constants.js');
var solver    = require('../components/solver.js');

var Box  = require('../app-components/app07/box.js');
var Ball = require('../components/ball.js');
var Plane = require('../components/plane.js');

var Vector2 = require('ks-vector').Vector2;
var cw, ch;

var App = function() {
	this.loop = this.loop.bind(this);


	this.canvas = document.getElementById('c');
	cw = window.innerWidth;
	ch = window.innerHeight;
	this.canvas.width = cw;
	this.canvas.height = ch;

	this.ctx = this.canvas.getContext('2d');

	this.mObjects = [];

	var box = new Box(1, 0, 300, 100, 100);
	this.mObjects.push(box);

	this.ball = new Ball(10, 30, new Vector2( 100, 0), new Vector2(0, 0));
	this.mObjects.push(this.ball);



	var width = 400;
	var plane = new Plane(width/2, window.innerHeight - 100, width);
	this.mObjects.push(plane);

}

App.prototype.loop = function() {

};

App.prototype.render = function() {
	var dt = CONSTANTS.timeStep;
	// ---------------
  this.generateMotionBounds(dt);
  // ---------------

  this.contacts = this.collide();
  solver(this.contacts);

  for(var ii in this.mObjects){
    this.mObjects[ii].update(dt);
  }

	// -------------------------
	//  draw
	// -------------------------

	this.ctx.fillStyle = "#ffffff";
	this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

	for(var ii in this.mObjects){
		this.mObjects[ii].draw(this.ctx);
	}


	if(this.ball.y > window.innerHeight + this.ball.rad){
		this.ball.pos.set(100, -this.ball.rad)
		this.ball.vel.set(0, 0)
	}


};

App.prototype.generateMotionBounds = function(dt) {
  for(var ii in this.mObjects){
    this.mObjects[ii].generateMotionAABB(dt);
  }
};

App.prototype.collide = function() {
  var contacts = [];

  for (var ii = 0; ii < this.mObjects.length - 1; ii++) {
    var rigidBodyA = this.mObjects[ii];
    for(var jj = ii + 1; jj < this.mObjects.length; jj++){
      var rigidBodyB = this.mObjects[jj];

      if( rigidBodyA.mass != 0 || rigidBodyB.mass != 0 ){
        if(AABB.overlap(rigidBodyA.motionBounds, rigidBodyB.motionBounds)){
            var _contacts = rigidBodyA.getClosestPoints(rigidBodyB);
            contacts = contacts.concat(_contacts);
        }
      }
    }
  }

  return contacts;
}

module.exports = App;

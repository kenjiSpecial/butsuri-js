var Ball      = require('./components/ball.js');
var Floor     = require('./components/floor.js');
var Box       = require('./components/box.js');
var AABB      = require('./components/aabb.js');

var Vector2   = require('ks-vector').Vector2;
var CONSTANTS = require('./components/constants.js');
var solver    = require('./components/solver.js');
var Plane     = require('./components/plane.js');
var cw, ch;


var App = function() {
  this.canvas = document.getElementById('c');
  cw = window.innerWidth;
  ch = window.innerHeight;
  this.canvas.width  = cw;
  this.canvas.height = ch;

  this.ctx    = this.canvas.getContext('2d');

  this.mObjects = [];

  /**
  for(var ii = 0; ii < 100; ii++){
    var boxWid = 30 + parseInt(70 * Math.random());
    var boxHig = 30 + parseInt(70 * Math.random());
    var yPos = - 50 - boxHig;
    var xPos = window.innerWidth/2 - 100 + 200 * Math.random();
    //var box = new Box( boxWid*boxHig, xPos, yPos, boxWid, boxHig);
    var ball = new Ball(1, 10, new Vector2(window.innerWidth * Math.random(), 100), new Vector2(0, 100) );
    //box.angle = Math.random() * Math.PI;
    this.mObjects.push(ball);
  } */

  //var ball = new Ball(1, 30, new Vector2(200, window.innerHeight/2), new Vector2(0, 0));
  //this.mObjects.push(ball
  // );
  //var ball = new Ball(1, 30, new Vector2(window.innerWidth, window.innerHeight/2), new Vector2(-100, 0));
  //ball.angularVel = Math.PI * 10;
  //this.mObjects.push(ball);

  //var box = new Box(100, window.innerWidth/2 - 30, window.innerHeight/2 - 30, 60, 60);
  //box.vel.x = 20;
  //this.mObjects.push(box);

  //var floor = new Floor(10, window.innerHeight - 50, window.innerWidth - 20, 30);
  //this.mObjects.push(floor);

  var ball = new Ball(10, 10, new Vector2(window.innerWidth/2, 0), new Vector2(0, 0));
  this.mObjects.push(ball);

  var plane = new Plane(window.innerWidth/2, 120, (window.innerWidth - 200) );
  this.mObjects.push(plane)



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

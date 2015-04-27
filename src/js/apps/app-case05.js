
var Ball      = require('../app-components/app05/moving-ball.js');

var OutlineBall = require('../app-components/app05/ball.js');
var Floor     = require('../components/floor.js');
var Box       = require('../components/box.js');
var AABB      = require('../components/aabb.js');
var CONSTANTS = require('../components/constants.js');
var solver    = require('../components/solver.js');

var Vector2   = require('ks-vector').Vector2;
var cw, ch;


var App = function() {
  this.loop = this.loop.bind(this);
  this.changeGravity = this.changeGravity.bind(this);

  this.canvas = document.getElementById('c');
  cw = window.innerWidth;
  ch = window.innerHeight;
  this.canvas.width  = cw;
  this.canvas.height = ch;

  this.ctx    = this.canvas.getContext('2d');

  this.mObjects = [];

  for(var ii = 0; ii < 15; ii++){
    var ball = new Ball();
    this.mObjects.push(ball);
  }


  var ball = new OutlineBall();
  this.mObjects.push(ball);
  this.count = 0;

  // setTimeout(this.loop, 1000);

  // setTimeout(this.changeGravity, 3000);
};

App.prototype.changeGravity = function() {
  if(Math.random() < .5){
    CONSTANTS.gravity = -10;
  }else{
    CONSTANTS.gravity = 10;
  }

  setTimeout(this.changeGravity, 3000);
}

App.prototype.loop = function() {
  for(var ii = 0; ii < 3; ii++){

    var ball = new Ball();
    this.mObjects.push(ball);
  }

  this.count++;

  if(this.count < 12) setTimeout(this.loop, 1000);
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

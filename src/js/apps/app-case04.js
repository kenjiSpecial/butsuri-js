var Ball      = require('../app-components/app04/ball.js');
var Floor     = require('../components/floor.js');
var Box       = require('../components/box.js');
var AABB      = require('../components/aabb.js');
var CONSTANTS = require('../components/constants.js');
var solver    = require('../components/solver.js');

var Wiper = require('../app-components/app04/wiper.js');
var WiperRectangle = require('../app-components/app04/wiper-rectangle.js');

var Vector2   = require('ks-vector').Vector2;
var cw, ch;

var App = function() {
  this.canvas = document.getElementById('c');
  cw = window.innerWidth;
  ch = window.innerHeight;
  this.canvas.width  = cw;
  this.canvas.height = ch;

  this.ctx    = this.canvas.getContext('2d');

  this.mObjects = [];

  var wiper = new Wiper(this.mObjects);

  for(var ii = 0 ; ii < 100; ii++){
    var xPos = window.innerWidth * Math.random();
    var yPos = window.innerHeight * Math.random() * -1;
    var velY = 250 + 50 * Math.random();
    var ball = new Ball(10, 30, new Vector2(xPos, yPos), new Vector2(0, velY));
    this.mObjects.push(ball);
  }


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

App.prototype.reset = function() {
  this.ctx.fillStyle = "#ffffff";
  this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
}

module.exports = App;

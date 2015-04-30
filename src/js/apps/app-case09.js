var Ball      = require('../components/ball.js');
var Floor     = require('../components/floor.js');
var Line      = require('../components/line.js');
var Box       = require('../components/box.js');
var AABB      = require('../components/aabb.js');
var CONSTANTS = require('../components/constants.js');
var solver    = require('../components/solver.js');

var SpecialBalls = require('../app-components/app09/ball.js');
var Frame = require('../app-components/app09/frame.js');

var Vector2   = require('ks-vector').Vector2;
var cw, ch;



var App = function() {
  this.onLoadImageHandler = this.onLoadImageHandler.bind(this);

  this.isRender = false;

  this.image = new Image();
  this.image.src = "./weave.png";
  this.image.onload = this.onLoadImageHandler;
  this.image.onerror = function() {
    console.log('error');
  }
}

App.prototype.onLoadImageHandler = function(ev) {
  this.imageData = [];


  var canvas = document.createElement("canvas");
  canvas.width = this.image.width;
  canvas.height= this.image.height;
  var ctx = canvas.getContext('2d');

  ctx.drawImage(this.image, 0, 0);

  this.imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  //console.log(this.imageData);

  this.initialize();
}

App.prototype.initialize = function(){

  this.canvas = document.getElementById('c');
  cw = window.innerWidth;
  ch = window.innerHeight;
  this.canvas.width  = cw;
  this.canvas.height = ch;

  this.ctx    = this.canvas.getContext('2d');

  this.mObjects = [];

	this.frame = new Frame(this.mObjects);

	var spBall = new SpecialBalls(this.mObjects, this.frame, this.imageData);

  this.isRender = true;

};

App.prototype.render = function() {
  if(!this.isRender) return;

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

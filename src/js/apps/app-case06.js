
var Ball      = require('../app-components/app06/moving-ball.js');

var OutlineBall = require('../app-components/app06/ball.js');
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
  this.changeGravity()



  for(var ii = 0; ii < 50; ii++){
    var ball = new Ball();
    this.mObjects.push(ball);
  }

  var ball = new OutlineBall();
  this.mObjects.push(ball);
  this.count = 0;

};

App.prototype.changeGravity = function() {
  var rand = Math.random();
  if(rand < .25){
    CONSTANTS.id = 0;
    CONSTANTS.ggravity = new Vector2(0, 1);
  }else if(rand  < .5){
    CONSTANTS.id = 1;
    CONSTANTS.ggravity = new Vector2(0, -1);
  }else if(rand < .75){
    CONSTANTS.id = 2;
    CONSTANTS.ggravity = new Vector2(1, 0);
  }else{
    CONSTANTS.id = 3;
    CONSTANTS.ggravity = new Vector2(-1, 0);
  }



  setTimeout(this.changeGravity, 1200);
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


module.exports = App;


var Ball      = require('./components/ball.js');
var Floor     = require('./components/floor.js');
var Box       = require('./components/box.js');
var AABB      = require('./components/aabb.js');

var Vector2   = require('ks-vector').Vector2;
var CONSTANTS = require('./components/constants.js');
var solver    = require('./components/solver.js');
var cw, ch;

var App = function() {
  this.startTime = new Date().getTime();
  this.canvas = document.getElementById('c');
  cw = window.innerWidth;
  ch = window.innerHeight;
  this.canvas.width  = cw;
  this.canvas.height = ch;

  this.ctx    = this.canvas.getContext('2d');

  this.mObjects = [];

  this.floor = new Floor( window.innerWidth/2 - 200, window.innerHeight - 60, 400, 20);
  this.mObjects.push(this.floor);

  var floor1 = new Floor( window.innerWidth/2 - 200, window.innerHeight/2 + 60, 200, 40)
  floor1.angle = Math.PI / 12;
  this.mObjects.push(floor1);

  this.floor2 = new Floor( window.innerWidth/2 , window.innerHeight/2 - 150, 200, 40)
  this.floor2.angle = -Math.PI / 12;
  this.mObjects.push(this.floor2);


  var self = this;

  function add(){
    var boxWid = 30 + parseInt(70 * Math.random());
    var boxHig = 30 + parseInt(70 * Math.random());
    var yPos = - 50 - boxHig;
    var xPos = window.innerWidth/2 - 100 + 200 * Math.random();
    var box = new Box( boxWid*boxHig, xPos, yPos, boxWid, boxHig);
    box.angle = Math.random() * Math.PI;
    self.mObjects.push(box)

    if(self.mObjects.length < 12) setTimeout(add, 750);
  }

  add();

};

App.prototype.generateMotionBounds = function(dt) {
  for(var ii in this.mObjects){
    this.mObjects[ii].generateMotionAABB(dt);
  }

};

App.prototype.render = function() {
  var dt = CONSTANTS.timeStep;

  this.floor.loopMovement(dt)
  for(var ii in this.mObjects){
    this.mObjects[ii].update(dt);
  }

  // ---------------
  this.generateMotionBounds(dt);
  // ---------------

  this.contacts = this.collide();
  solver(this.contacts);


  this.draw();
};

App.prototype.draw = function() {

  this.ctx.fillStyle = "#ffffff";
  this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

  for(var ii in this.mObjects){
    this.mObjects[ii].draw(this.ctx);
  }

  return;

  if(window.worldEdge0){
    this.ctx.beginPath();
    this.ctx.fillStyle = "#00ff00";
    this.ctx.arc(window.worldEdge0.x, window.worldEdge0.y, 10, 0, 2 * Math.PI);
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.fillStyle = "#00ff00";
    this.ctx.arc(window.worldEdge1.x, window.worldEdge1.y, 10, 0, 2 * Math.PI);
    this.ctx.fill();
  }

  if(window.pointA){

    this.ctx.beginPath();
    this.ctx.fillStyle = "#ff0000";
    this.ctx.arc(window.pointA[0].x, window.pointA[0].y, 10, 0, 2 * Math.PI);
    this.ctx.fill();

    // -------------------

    this.ctx.beginPath();
    this.ctx.fillStyle = "#ff0000";
    this.ctx.arc( window.pointA[1].x, window.pointA[1].y, 10, 0, 2 * Math.PI);
    this.ctx.fill();

  }

  if(window.pointB){
    this.ctx.beginPath();
    this.ctx.fillStyle = "#ff0000";
    this.ctx.arc(window.pointB[0].x, window.pointB[0].y, 10, 0, 2 * Math.PI);
    this.ctx.fill();

    // -------------------

    this.ctx.beginPath();
    this.ctx.fillStyle = "#ff0000";
    this.ctx.arc( window.pointB[1].x, window.pointB[1].y, 10, 0, 2 * Math.PI);
    this.ctx.fill();
  }

  //this.contacts.draw(this.ctx);
  for (var ii = 0; ii < this.contacts.length; ii++) {
    this.contacts[ii].draw(this.ctx);
  }
}

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

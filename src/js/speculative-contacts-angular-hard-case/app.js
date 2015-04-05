
var Ball      = require('./components/ball.js');
var Floor     = require('./components/floor.js');
var Box       = require('./components/box.js');

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

  var floor = new Floor(20, window.innerHeight - 100, window.innerWidth - 40, 20);

  this.mObjects.push(floor);

  var box = new Box(window.innerWidth/2 - 50, 10, 100, 100);
  this.mObjects.push(box);

};

App.prototype.generateMotionBounds = function(dt) {
  for(var ii in this.mObjects){
    this.mObjects[ii].generateMotionAABB(dt);
  }

};

App.prototype.render = function() {
  var dt = CONSTANTS.timeStep;

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
}

App.prototype.collide = function() {
  var contacts = [];

  for (var ii = 0; ii < this.mObjects.length - 1; ii++) {
    for(var jj = ii + 1; jj < this.mObjects.length; jj++){
      if( this.mObjects[ii].mass != 0 || this.mObjects[jj].mass != 0 ){
        var _contacts = this.mObjects[ii].getClosestPoints(this.mObjects[jj]);
        contacts = contacts.concat(_contacts);
      }
    }
  }

  return contacts;
}

module.exports = App;

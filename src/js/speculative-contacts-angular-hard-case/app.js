
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
  var box = new  Box(10, window.innerWidth/2 - 30, 30, 60, 60);
  this.mObjects.push(floor);
  this.mObjects.push(box);
};

App.prototype.render = function() {
  for(var ii in this.mObjects){
    this.mObjects[ii].update(CONSTANTS.timeStep);
  }


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

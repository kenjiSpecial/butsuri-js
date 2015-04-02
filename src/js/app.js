
var Ball = require('./components/ball.js');
var Floor = require('./components/floor.js');
var Vector2 = require('ks-vector').Vector2;
var CONSTANTS = require('./components/constants.js');
var cw, ch;

var App = function() {
  this.startTime = new Date().getTime();
  this.canvas = document.getElementById('c');
  cw = window.innerWidth;
  ch = window.innerHeight;
  this.canvas.width  = cw;
  this.canvas.height = ch;

  this.ctx    = this.canvas.getContext('2d');

  var ballPos = new Vector2(window.innerWidth/2, 20);
  var ballVel = new Vector2(0, 0);

  this.ball = new Ball(1, 10, ballPos, ballVel );
  this.floor = new Floor(window.innerWidth/2 - 100, window.innerHeight - 110, 200, 10);

  this.mObjects = [];
  this.mObjects.push(this.ball);
  this.mObjects.push(this.floor);
};

App.prototype.render = function() {

  this.ball.update(CONSTANTS.timeStep);
  this.floor.update();

  this.contacts = this.collide();


  this.draw();
};

App.prototype.draw = function() {

  this.ctx.fillStyle = "#ffffff";
  this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

  this.ball.draw(this.ctx);
  this.floor.draw(this.ctx);
}

App.prototype.collide = function() {
  var contacts;

  for (var ii = 0; ii < this.mObjects.length - 1; ii++) {
    for(var jj = ii + 1; jj < this.mObjects.length; jj++){
      if( this.mObjects[ii].mass != 0 || this.mObjects[jj].mass != 0 ){
        this.mObjects[ii].getClosestPoints(this.mObjects[jj]);
        
      }
    }
  }

  return contacts;
}

module.exports = App;

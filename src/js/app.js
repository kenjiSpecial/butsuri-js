
var Ball      = require('./components/ball.js');
var Floor     = require('./components/floor.js');
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

  var wid = window.innerHeight / 5;
  var hig = 30;

  for(var ii = 0; ii < 80; ii++){
    var ballRad = 5 + 20*Math.random() | 0;
    var posX = window.innerWidth/2 - wid * 2 + Math.random() * wid * 4;
    var posY =  - 400 * Math.random() - ballRad * 2;

    var ball = new Ball(ballRad * ballRad, ballRad, new Vector2(posX, posY), new Vector2(0, 0));
    this.mObjects.push(ball);
  }

  var floor0 = new Floor(window.innerWidth /2 - wid/2, window.innerHeight/5 * 1.5 - hig/2-30, wid, hig);
  floor0.setVelTheta(1/30*Math.PI);

  var floor1 = new Floor(window.innerWidth /2 - wid/2 + wid, window.innerHeight/5 * 2.5 - hig/2, wid, hig);
  floor1.setVelTheta(-1/60*Math.PI);

  var floor3 = new Floor(window.innerWidth /2 - wid/2 - wid, window.innerHeight/5 * 2.5 - hig/2, wid, hig);
  floor3.setVelTheta(1/60*Math.PI);

  var floor2 = new Floor(window.innerWidth/2 - wid/2, window.innerHeight/5 * 3. - hig/2 + 30, wid, hig);
  floor2.setVelTheta(1/30*Math.PI);



  this.mObjects.push(floor0);
  this.mObjects.push(floor1);
  this.mObjects.push(floor2);
  this.mObjects.push(floor3);
};

App.prototype.render = function() {

  for(var ii in this.mObjects){
    this.mObjects[ii].update(CONSTANTS.timeStep);
  }

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

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

  var box = new Box(100 * 100, window.innerWidth/2 - 50, 0, 100, 100);
  this.mObjects.push(box);

  //for(var ii = 0; ii < )
  var self = this;
  var count = 0;


  var loop = function(){
    count++;
    var xPos = window.innerWidth/2 - 200 + 400 * Math.random()
    var rad = 50 + parseInt(50 * Math.random());
    //var mag = rad * rad;
    //var ball = new Ball( mag, rad, new Vector2(xPos, 0), new Vector2(0, 500));

    var box = new Box( rad * rad, xPos - rad/2, 0, rad, rad);
    self.mObjects.push(box);

    if(count < 30) setTimeout(loop, 1000);

  };

  //loop();

  setTimeout(loop, 1000);

  // var ball = new Ball(10, 10, new Vector2(window.innerWidth/2, 0), new Vector2(0, 0));
  // this.mObjects.push(ball);

  //var plane = new Plane(window.innerWidth/2, 200, (window.innerWidth - 200) );
  // this.mObjects.push(plane)

  var floor = new Floor( 0, window.innerHeight/2, window.innerWidth, 1 );
  this.mObjects.push(floor)




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

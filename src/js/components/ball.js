var constants = require('./constants.js');
var Vector2 = require('ks-vector').Vector2;
var RigidBody = require('./rigid-body.js');
var Floor = require('./floor.js');
var Contact = require('./contact.js');

var Ball = function( _mass, _rad, _pos, _vel ) {
  RigidBody.call(this, _mass, _rad, _rad, _pos, _vel)
  this.radius = _rad;

};

Ball.prototype = Object.create(Ball.prototype);
Ball.prototype.constructor = Ball;


Ball.prototype.update = function( dt ) {

  RigidBody.prototype.setGravity.call(this);
  RigidBody.prototype.update.call(this, dt);

}

Ball.prototype.draw = function(ctx) {

  ctx.fillStyle = "#000000"
  ctx.beginPath();
  ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
  ctx.fill();

};

Ball.prototype.getClosestPoints = function(rBody) {
  var contacts;
  var ballA = this;

  if(rBody instanceof Ball){

    var ballB = rBody;

    var delata = new Vector2( ballA.x - ballB.x, ballA.y - ballB.y );
    var n;

    if( delata.getLength() ){
      n = delata.getNormal();
    }else{
      n = new Vector2(1, 0);
    }

    // generate closes points
    var pa = new Vector2();
    pa.x = ballA.pos.x + n.x * this.radius;
    pa.y = ballA.pos.y + n.y * this.radius;

    var pb = new Vector2();
    pb.x = ballB.pos.x - n.x * this.radius;
    pb.y = ballB.pos.y - n.y * this.radius;

    // getdistance
    var dist = delata.getLength() - (ballA.radius + ballB.radius);

    contacts = new Contact( ballA, ballB, pa, pb, n, dist );

  }else if(rBody instanceof Floor){
    var rectangleB = rBody;

    contacts = rectangleB.getClosestPoints(this);


  }else{
    console.error("===== NO getClosestPoints IN Ball =====");
  }

  return contacts;
}


module.exports = Ball;

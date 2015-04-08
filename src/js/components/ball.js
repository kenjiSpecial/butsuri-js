var constants = require('./constants.js');
var Vector2 = require('ks-vector').Vector2;
var RigidBody = require('./rigid-body.js');
var Floor = require('./rectangle.js');
var Contact = require('./contact.js');
var utils   = require('./utils.js');

var Ball = function( _mass, _rad, _pos, _vel ) {
  RigidBody.call(this, _mass, _rad, _rad, _pos, _vel)
  this.rad = _rad;

  if(this.invMass > 0){
    var I = this.mass * this.rad * this.rad / 4;
    this.invI = 1 / I;
    console.log(this.invI);
  }else{
    this.invI = 0;
  }

};

Ball.prototype = Object.create(RigidBody.prototype);
Ball.prototype.constructor = Ball;


Ball.prototype.update = function( dt ) {

  RigidBody.prototype.setGravity.call(this);

  this.vel.x += this.force.x * this.invMass;
  this.vel.y += this.force.y * this.invMass;

  RigidBody.prototype.update.call(this, dt);

}

Ball.prototype.draw = function(ctx) {

  ctx.save();

  ctx.translate(this.pos.x, this.pos.y);
  ctx.rotate(this.angle);

  ctx.fillStyle = "#000000"
  ctx.beginPath();
  ctx.arc( 0, 0, this.rad, 0, 2 * Math.PI);
  ctx.fill();

  ctx.strokeStyle = "#ffffff";
  ctx.beginPath();
  ctx.moveTo( -5, 0);
  ctx.lineTo(  5, 0);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, -5);
  ctx.lineTo(0, 5);
  ctx.stroke();

  ctx.restore();


  if(this.pos.x > window.innerWidth + this.rad * 2 || this.pos.x < 0 - this.rad * 2 || this.pos.y + this.rad*2 > window.innerHeight + this.rad * 2){
    this.reset();
  }
};

Ball.prototype.reset = function() {
  this.pos = new Vector2(window.innerWidth/2 - 100 + 200 * Math.random(), -this.rad * 2 - 400 * Math.random());
  this.vel = new Vector2();
}

Ball.prototype.getClosestPoints = function(rBody) {
  var contacts = [];
  var ballA = this;

  if(rBody instanceof Ball){

    var ballB = rBody;

    var delata = new Vector2( ballB.pos.x - ballA.pos.x, ballB.pos.y - ballA.pos.y );
    var n;

    if( delata.getLength() ){
      n = delata.getNormal();
    }else{
      n = new Vector2(1, 0);
    }

    // generate closes points
    var pa = new Vector2();
    pa.x = ballA.pos.x + n.x * ballA.rad;
    pa.y = ballA.pos.y + n.y * ballA.rad;

    var pb = new Vector2();
    pb.x = ballB.pos.x - n.x * ballB.rad;
    pb.y = ballB.pos.y - n.y * ballB.rad;

    // getdistance
    var dist = delata.getLength() - (ballA.rad + ballB.rad);

    contacts.push(new Contact( ballA, ballB, pa, pb, n, dist ));

  }else if(rBody instanceof Floor){
    var rectangleB = rBody;

    contacts = rectangleB.getClosestPoints(this);
    utils.flipContacts(contacts);

  }else{
    console.error("===== NO getClosestPoints IN Ball =====");
  }

  return contacts;
};





module.exports = Ball;

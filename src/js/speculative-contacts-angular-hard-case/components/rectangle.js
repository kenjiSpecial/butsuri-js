var constants = require('./constants.js');
var Vector2 = require('ks-vector').Vector2;
var RigidBody = require('./rigid-body.js');
var Contact = require('./contact.js');

var Ball;

var Matrix = require('./matrix.js');


var Rectangle = function(mass, x, y, wid, hig) {

    RigidBody.call(this, mass, wid, hig, new Vector2(x + wid/2, y + hig/2), new Vector2(0, 0));


    Ball = require('./ball.js');

    /*
    this.matrix = new Matrix();
    this.matrix.set(this.theta, 0, 0);
    this.halfExtendMinus = new Vector2( -wid/2, -hig/2 );
    this.halfExtendPlus  = new Vector2(  wid/2,  hig/2 );
    */

    this.halfExtents = new Vector2(this.width/2, this.height/2);



}

Rectangle.prototype = Object.create(RigidBody.prototype);
Rectangle.prototype.constructor = Rectangle;

Rectangle.prototype.update = function(dt) {
  //this.theta += this.thetaVelocity;
  //this.matrix.set(this.theta, 0, 0);

  RigidBody.prototype.setGravity.call(this);
  RigidBody.prototype.update.call(this, dt);
}

Rectangle.prototype.draw = function(ctx) {

  ctx.save();

  ctx.strokeStyle = "#000000";
  ctx.beginPath();
  ctx.translate(this.pos.x, this.pos.y);
  ctx.rotate(this.angle);
  ctx.strokeRect(-this.width/2, -this.height/2, this.width, this.height);

  ctx.restore();



  //this.debugDraw(ctx);
};

Rectangle.prototype.debugDraw = function(ctx) {

  ctx.fillStyle = "#ff0000";
  ctx.beginPath();

  ctx.arc(this.clamedP.x, this.clamedP.y, 2, 0, 2 * Math.PI);
  ctx.fill()

  ctx.strokeStyle = "#0000ff";
  ctx.beginPath();
  ctx.moveTo(this.clamedP.x, this.clamedP.y);
  ctx.lineTo(this.clamedP.x + this.d.x, this.clamedP.y + this.d.y);
  ctx.stroke();

  ctx.fillStyle = "#00ff00";
  ctx.beginPath();

  ctx.arc(this.pb.x, this.pb.y, 2, 0, 2 * Math.PI);
  ctx.fill();

}

Rectangle.prototype.getClosestPoints = function(rBody) {
  var contacts = [];

  if( rBody instanceof Ball ){
    var rectangelA = this;
    var ballB      = rBody;

    var xPos = ballB.pos.x - rectangelA.pos.x;
    var yPos = ballB.pos.y - rectangelA.pos.y;
    var delta = new Vector2();
    delta.set(xPos, yPos);
    //console.log(delta.x + ", " + delta.y);

    this.matrix.set(this.theta, 0, 0);
    var rotatedDeltaX =  delta.x * this.matrix.cos + delta.y * this.matrix.sin;
    var rotatedDeltaY = -delta.x * this.matrix.sin + delta.y * this.matrix.cos;

    var rotatedVector = new Vector2();
    rotatedVector.set(rotatedDeltaX, rotatedDeltaY);
    //console.log(rotatedVector.x + ', ' + rotatedVector.y);

    var dClamped = rotatedVector.clamp(this.halfExtendMinus, this.halfExtendPlus);

    var clamped  = dClamped.rotate(this.theta);
    var clamedP = this.pos.copy().add(clamped);


    var d = new Vector2();
    d.set( ballB.pos.x - clamedP.x, ballB.pos.y - clamedP.y );
    var n = d.getNormal();

    var pa = clamedP;
    var pb = ballB.pos.copy().subtractMultipledVector(ballB.radius, n);
    //console.log(pb.x + ", " + pb.y);

    var dist = d.getLength() - ballB.radius;


    this.clamedP = clamedP;
    this.d = d;
    this.pb =pb;

    contacts.push(new Contact( rectangelA, ballB, pa, pb, n, dist ));
  }

  return contacts;
};

Rectangle.prototype.generateMotionAABB = function(dt) {
  // get bounds now
  // body
}


module.exports = Rectangle;

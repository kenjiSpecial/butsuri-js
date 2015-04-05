var constants = require('./constants.js');
var Vector2 = require('ks-vector').Vector2;
var RigidBody = require('./rigid-body.js');
var Contact = require('./contact.js');

var Ball;

var Matrix = require('./matrix.js');


var Rectangle = function(mass, x, y, wid, hig) {

    RigidBody.call(this, mass, wid, hig, new Vector2(x + wid/2, y + hig/2), new Vector2(0, 0));


    Ball = require('./ball.js');

    this.halfExtents = new Vector2( this.width/2, this.height/2 );
    this.halfExtentsMinus = new Vector2( -this.width/2, -this.height/2);

    this.localSpacePoints = [
        new Vector2(  this.halfExtents.x, -this.halfExtents.y),
        new Vector2( -this.halfExtents.x, -this.halfExtents.y),
        new Vector2( -this.halfExtents.x,  this.halfExtents.y),
        new Vector2(  this.halfExtents.x,  this.halfExtents.y)
    ];

    this.localSpaceNormals = [];

    for(var ii = 0; ii < this.localSpacePoints.length; ii++){
      var nextNum = (ii + 1) % this.localSpacePoints.length;
      this.localSpaceNormals[ii] = this.localSpacePoints[nextNum].copy().subtract(this.localSpacePoints[ii]).getNormal().perp();
    }

    // calculate the inverse inertia tensor
    if(this.invMass > 0){
      var I = this.mass * (this.width * this.width + this.height * this.height) / 12;
      this.invI = 1 / I;
    }else{
      this.invI = 0;
    }


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

    var delta = ballB.pos.copy().subtract(rectangelA.pos);

    var rotatedVector = delta.rotate(-this.angle);

    var dClamped = rotatedVector.clamp(this.halfExtentsMinus, this.halfExtents);

    var clamped  = dClamped.rotate(this.angle);
    var clamedP = this.pos.copy().add(clamped);

    var d = new Vector2(ballB.pos.x - clamedP.x, ballB.pos.y - clamedP.y);
    var n = d.getNormal();

    var pa = clamedP;
    var pb = ballB.pos.copy().subtractMultipledVector(ballB.rad, n);
    //console.log(pb.x + ", " + pb.y);

    var dist = d.getLength() - ballB.rad;


    this.clamedP = clamedP;
    this.d = d;
    this.pb =pb;


    contacts.push(new Contact( rectangelA, ballB, pa, pb, n, dist ));
  }

  console.log(rBody instanceof Rectangle);

  return contacts;
};

Rectangle.prototype.generateMotionAABB = function(dt) {
  // get bounds now
  // body
}


module.exports = Rectangle;

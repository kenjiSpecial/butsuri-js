var constants = require('./constants.js');
var Vector2 = require('ks-vector').Vector2;
var RigidBody = require('./rigid-body.js');
var Contact = require('./contact.js');
var Geometry = require('./geometry.js');
var AABB = require('./aabb.js');
var Ball;

var Matrix = require('./matrix23.js');


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
  //console.log(this.pos.y);
  //console.log(this.pos.x);

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

  /**
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
  */
}

Rectangle.prototype.getClosestPoints = function(rBody) {
  var contacts = [];
  var rectangelA = this;

  if( rBody instanceof Ball ){

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
  }else if(rBody instanceof Rectangle){
    var bRectangle = rBody

    return Geometry.rectRectClosestPoints(this, bRectangle);
  }else if(rBody instanceof Plane){

    /*
    var rectangelB = rBody;

    var worldP = [];
    var worldD = [];


    for( var ii = 0; ii <  this.localSpacePoints.length; ii++ ){
        var  worldVector = this.matrix.transformBy(this.localSpacePoints[ii].copy());
        worldD.push(worldVector) ;
    }

    this.worldD = worldD; */
  }

  return contacts;
};

Rectangle.prototype.generateMotionAABB = function(dt) {
  // get bounds now
  var boundsNow = AABB.buildAABB( this.localSpacePoints, this.matrix );
  var matrixNextFrame = new Matrix();
  matrixNextFrame.setAngleAndPos(this.angle + this.angularVel * dt, this.pos.copy().addMultipledVector(dt, this.vel) );
  var boundsNextFrame = AABB.buildAABB(this.localSpacePoints, matrixNextFrame);

  this.motionBounds = new AABB();
  this.motionBounds.setAABB( boundsNow, boundsNextFrame );
};

/**
* @param {Vector2} direction
*/

Rectangle.prototype.getSupportVertices = function(direction) {
  // rotate into rectangle space
  var v = this.matrix.RotateIntoSpaceOf(direction.copy());

  // get axis bits
  var closestI = -1;
  var secondClosestI = -1;
  var closestD = -99999;
  var secondClosestD = -99999;

  // first support
  for(var ii = 0; ii < this.localSpacePoints.length; ii++){
    var d = v.copy().dotProduct(this.localSpacePoints[ii]);

    if(d > closestD){
      closestD = d;
      closestI = ii;
    }
  }

  // second support
  var num = 1;
  for(var ii = 0; ii < this.localSpacePoints.length; ii++){
    var d = v.copy().dotProduct(this.localSpacePoints[ii]);

    if(ii != closestI && d == closestD){
      secondClosestD = d;
      secondClosestI = ii;
      num++;
      break;
    }
  }

  // closest vertices
  var spa = [];
  spa[0] = {mI: closestI, mV: this.matrix.transformBy( this.localSpacePoints[closestI] )}
  if(num > 1){
    spa[1] = {mI: secondClosestI, mV: this.matrix.transformBy( this.localSpacePoints[secondClosestI] )};
  }

  return spa;
}

/**
*  @param {Number}  v
*  @param {Vector2} n
*/

Rectangle.prototype.getSecondSupport = function( v, n) {
    var va = this.getWorldSpacePoint( (v - 1 + this.localSpacePoints.length)%this.localSpacePoints.length );
    var vb = this.getWorldSpacePoint( v );
    var vc = this.getWorldSpacePoint( (v+1)%this.localSpacePoints.length );

    var na = vb.copy().subtract(va).perp().getNormal();
    var nc = vc.copy().subtract(vb).perp().getNormal();

    var support = [];

    if(na.dotProduct(n) < nc.dotProduct(n)){
      support[0] = va;
      support[1] = vb;
    }else{
      support[0] = vb;
      support[1] = vc;
    }

    return support;
};

/**
* @param {Number} ii
*/
Rectangle.prototype.getWorldSpacePoint = function(ii) {
  return this.matrix.transformBy(this.localSpacePoints[ii]);
}

/**
* @param {Number} ii
*/

Rectangle.prototype.getWorldSpaceNormal = function(ii) {
  return this.matrix.rotateBy(this.localSpaceNormals[ii]);
}

/**
* @param {context}
*/

Rectangle.prototype.drawAABB = function(ctx) {
  //console.log(this.motionBounds);
  ctx.fillStyle = "#ff0000";
  ctx.beginPath();
  ctx.arc( this.motionBounds.mCenter.x, this.motionBounds.mCenter.y, 2, 0, 2 * Math.PI );
  ctx.fill();

  var startVec = new Vector2( this.motionBounds.mCenter.x - this.motionBounds.mHalfExtents.x, this.motionBounds.mCenter.y - this.motionBounds.mHalfExtents.y );
  var endVec   = new Vector2( this.motionBounds.mCenter.x + this.motionBounds.mHalfExtents.x, this.motionBounds.mCenter.y + this.motionBounds.mHalfExtents.y );

  ctx.strokeStyle = "#0000ff";
  ctx.beginPath();
  ctx.moveTo(startVec.x, startVec.y);
  ctx.lineTo( endVec.x, endVec.y);
  ctx.stroke();

}


module.exports = Rectangle;

var constants = require('./constants.js');
var Vector2 = require('ks-vector').Vector2;
var RigidBody = require('./rigid-body.js');

var Ball;

var Matrix = require('./matrix.js');

var theta = Math.PI/10;

var Floor = function(x, y, wid, hig) {
    RigidBody.call(this, 0, wid, hig, new Vector2(x + wid/2, y + hig/2), new Vector2(0, 0));

    Ball = require('./ball.js');

    this.matrix = new Matrix();
    this.matrix.set(theta, 0, 0);
    this.halfExtendMinus = new Vector2( -wid/2, -hig/2 );
    this.halfExtendPlus  = new Vector2(  wid/2,  hig/2 );
}

Floor.prototype = Object.create(RigidBody.prototype);
Floor.prototype.constructor = Floor;

Floor.prototype.update = function() {

}

Floor.prototype.draw = function(ctx) {
  ctx.save();

  ctx.strokeStyle = "#000000";
  ctx.beginPath();
  ctx.translate(this.pos.x, this.pos.y);
  ctx.rotate(theta);
  ctx.strokeRect(-this.width/2, -this.height/2, this.width, this.height);

  ctx.restore();
}

Floor.prototype.getClosestPoints = function(rBody) {
  //console.log(rBody instanceof Ball);
  if( rBody instanceof Ball ){
    var rectangelA = this;
    var ballB      = rBody;

    var delta = new Vector2( ballB.pos.x - rectangelA.pos.x, ballB.pos.y - rectangelA.pos.y );

    console.log(this.matrix);
    var rotatedDeltaX =  delta.x * this.matrix.cos + delta.y * this.matrix.sin;
    var rotatedDeltaY = -delta.x * this.matrix.sin + delta.y * this.matrix.cos;

    var rotatedVector = new Vector2( rotatedDeltaX, rotatedDeltaY );

    var dClamped = rotatedVector.clamp(this.halfExtendMinus, this.halfExtendPlus);
    var clamped  = dClamped.rotate(theta);
    var clamedP = this.pos.copy().add(clamped);

    var d = new Vector2( ballB.pos.x - clamedP.x, ballB.pos.y - clamedP.y);
    var n = d.getNormal();

    var na = clamedP;
    var pb = ballB.pos.copy().subtractMultipleVector(ballB.radius, n);

    var dist = d.getLength() - ballB.radius;

  }
};


module.exports = Floor;

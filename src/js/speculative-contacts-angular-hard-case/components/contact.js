var Vector2 = require('ks-vector').Vector2;

/**
*   @desc
*
*   @param {RigidBody} A
*   @param {RigidBody} B
*   @param {Vector2} pa
*   @param {Vector2} pb
*   @param {Vector2} n
*   @param {Number} dist
*/
var Contact = function(A, B, pa, pb, n, dist) {
  this.A  = A;
  this.B  = B;
  this.Pa = pa;
  this.Pb = pb;
  this.normal = n;
  this.Dist = dist;
  this.Impulse = 0;

  this.ra = pa.copy().subtract(A.pos).perp();
  this.rb = pb.copy().subtract(B.pos).perp();


  var aInvMass = A.invMass;
  var bInvMass = B.invMass;
  var ran = this.ra.dotProduct(n);
  var rbn = this.rb.dotProduct(n);

  var c = ran * ran * aInvMass;
  var d = rbn * rbn * bInvMass;

  this.invDenom = 1 / (aInvMass + bInvMass + c + d);

};

Contact.prototype = {
  /**
  * @param {Vector2} imp
  */
  applyImpulses : function(imp) {
    this.A.vel.addMultipledVector(this.A.invMass, imp);
    this.B.vel.subtractMultipledVector(this.B.invMass, imp);

    //console.log(this.A);
    //console.log(this.A.angle);
    // console.log(imp);
    // console.log(this.ra);
    //console.log(imp);
    //console.log(this.ra);
    //console.log(this.A.angularVel);
    //console.log(imp.x * this.ra.x);
    //console.log(imp.y * this.ra.y);
    //console.log(imp.dotProduct(this.ra));
    this.A.angularVel += imp.dotProduct(this.ra) * this.A.invI;

    this.B.angularVel += imp.dotProduct(this.rb) * this.B.invI;
  },

  /**
  * @return {Vector2}
  */

  getVelPa : function() {
    this.A.vel.copy().addMultipledVector(this.A.angularVel, this.ra);
  },

  /**
  * @return {Vector2}
  */

  getVelPb : function() {
    this.B.vel.copy().addMultipledVector(this.B.angularVel, this.rb);
  }

};



module.exports = Contact;

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
  this.mA  = A;
  this.mB  = B;
  this.mPa = pa;
  this.mPb = pb;
  this.mNormal = n;
  this.mDist = dist;
  this.mImpulse = 0;
};

Contact.prototype = {
  /**
  * @param {Vector2} imp
  */
  applyImpulses : function(imp) {
    this.mA.vel.addMultipledVector(this.mA.invMass, imp);
    this.mB.vel.subtractMultipledVector(this.mB.invMass, imp);
  },

};



module.exports = Contact;

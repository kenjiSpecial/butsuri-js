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
  this.mDist = dist;
  this.mImpulse = 0;
};

Contact.prototype = {
  /**
  * @param {Vector2} imp
  */
  applyImpulse : function(imp) {

  },

  /**
  * @param {Contact[]}
  */

  flipContacts: function(contacts) {

  }


};



module.exports = Contact;

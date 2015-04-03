var Vector2 = require('ks-vector').Vector2;
var CONSTANTS = require('./constants.js');

/**
* @param {Number}  mass
* @param {Number}  width
* @param {Number}  height
* @param {Vector2} posVector
* @param {Vector2} velVector
*/
var RigidBody = function( mass, width, height, pos, vel ) {
  //if(!instanceOf velVector) this.velVector =
  this.mass = mass;
  if(this.mass == 0) this.invMass = 0;
  else               this.invMass = 1 / mass;

  this.width = width;
  this.height = height;
  this.pos = pos;
  this.vel = vel;

  this.force = new Vector2(0, 0);
}

RigidBody.prototype.update = function(dt) {

  // --------------------

  this.vel.x += this.force.x * this.invMass;
  this.vel.y += this.force.y * this.invMass;

  // ====================

  this.pos.x += this.vel.x * dt;
  this.pos.y += this.vel.y * dt;

  // ====================

  this.force.set(0, 0);
};

RigidBody.prototype.setForce = function( xx, yy) {
  this.force.x += xx;
  this.force.x += xx;
};

RigidBody.prototype.setGravity = function() {
  this.force.y += this.mass * CONSTANTS.gravity;
};

RigidBody.prototype.getClosestPoints = function(rb) {
  console.error("===== NO getClosestPoints IN RigidBody =====");
}

module.exports = RigidBody;

var BaseBall = require("../../components/ball");
var CONSTANTS = require('../../components/constants.js');
var Vector2 = require('ks-vector').Vector2;

var Ball = function() {
    var mass = 10;
    var rad = 20 + parseInt(30 * Math.random());
    var xPos, yPos;

    if (CONSTANTS.id == 0) {
      xPos = window.innerWidth / 2 - 100 + 200 * Math.random();
      yPos = -100 * Math.random() - rad;
    } else if (CONSTANTS.id == 1) {
      xPos = window.innerWidth / 2 - 100 + 200 * Math.random();
      yPos = 100 * Math.random() + rad + window.innerHeight;
    } else if (CONSTANTS.id == 2) {
      xPos = -100 * Math.random() - this.rad;
      yPos = window.innerHeight / 2 - 100 + 200 * Math.random();
    } else if (CONSTANTS.id == 3) {
      xPos = window.innerWidth + 100 * Math.random() + this.rad;
      yPos = window.innerHeight / 2 - 100 + 200 * Math.random();
    }


    BaseBall.call(this, mass, rad, new Vector2(xPos, yPos), new Vector2(0, 0));

}


Ball.prototype = Object.create(BaseBall.prototype);
Ball.prototype.constructor = Ball;

Ball.prototype.update = function(dt) {

    this.force.y += CONSTANTS.ggravity.y * this.mass;
    this.force.x += CONSTANTS.ggravity.x * this.mass;


    this.vel.x += this.force.x * this.invMass;
    this.vel.y += this.force.y * this.invMass;

    this.angle += this.angularVel * dt;


    // ====================

    this.pos.x += this.vel.x * dt;
    this.pos.y += this.vel.y * dt;

    this.force.x = 0;
    this.force.y = 0;

    this.vel.x *= .97
    this.vel.y *= .97
    this.angularVel *= .97;
}

Ball.prototype.draw = function(ctx) {
    BaseBall.prototype.draw.call(this, ctx);

    if (CONSTANTS.id == 0) {
        if (this.pos.x < -this.rad || this.pos.x > window.innerWidth + this.rad || this.pos.y > window.innerHeight + this.rad) {
            this.reset1();
            return;
        }
    } else if (CONSTANTS.id == 1) {
        if (this.pos.x < -this.rad || this.pos.x > window.innerWidth + this.rad || this.pos.y < -this.rad) {
            this.reset2();
            return;
        }
    } else if (CONSTANTS.id == 2) {
        if (this.pos.x > window.innerWidth + this.rad || this.pos.y < -this.rad || this.pos.y > window.innerHeight + this.rad) {
            this.reset3();
            return;
        }

    } else if (CONSTANTS.id == 3) {
        if (this.pos.x < -this.rad || this.pos.y < -this.rad || this.pos.y > window.innerHeight + this.rad) {
            this.reset4();
            return;
        }
    }

}




Ball.prototype.reset1 = function() {
    this.pos = new Vector2(window.innerWidth / 2 - 100 + 200 * Math.random(), -100 * Math.random() - this.rad);
    this.vel = new Vector2(0, 0);
    this.angularVel = 0;
};

Ball.prototype.reset2 = function() {
    this.pos = new Vector2(window.innerWidth / 2 - 100 + 200 * Math.random(), window.innerHeight + 100 * Math.random() + this.rad);
    this.vel = new Vector2(0, 0);
    this.angularVel = 0;
};

Ball.prototype.reset3 = function() {
    var xPos, yPos;
    xPos = -100 * Math.random() - this.rad;
    yPos = window.innerHeight / 2 - 100 + 200 * Math.random();
    this.pos = new Vector2(xPos, yPos);
    this.vel = new Vector2(0, 0);
    this.angularVel = 0;
};

Ball.prototype.reset4 = function() {
    var xPos, yPos;
    xPos = window.innerWidth + 100 * Math.random() + this.rad;
    yPos = window.innerHeight / 2 - 100 + 200 * Math.random();

    this.pos = new Vector2(xPos, yPos);
    this.vel = new Vector2(0, 0);
    this.angularVel = 0;
};




module.exports = Ball;

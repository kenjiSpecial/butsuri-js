var floor;
var ctx;
var balls = [];

window.onload = function(){
  var canvas = document.getElementById('c');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  ctx = canvas.getContext('2d');



  floor = new Floor(window.innerWidth/2 - 60, window.innerHeight/2 - 50, 100, 100);
  //_mass, _rad, _pos, _vel
  for(var ii = 0; ii < 1000; ii++){
    var random = Math.random();
    var vel = new Vector2();

    if(random < .25)      vel.set(100 + 100 * Math.random(), 0);
    else if(random < .5)  vel.set(100 + 100 * Math.random(), 0);
    else if(random < .75) vel.set(0, -100 - 100 * Math.random());
    else vel.set(0, 100 + 100 * Math.random());

    var ball = new Ball( 1,1, new Vector2(window.innerWidth * Math.random(), window.innerHeight * Math.random()), vel);
    balls.push(ball)
  }

  loop();
}

function loop () {
  this.ctx.fillStyle = "#ffffff";
  this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

  floor.update();
  for(var ii = 0; ii < balls.length; ii++){
    balls[ii].update();
  }

  floor.draw(ctx);
  for(var ii = 0; ii < balls.length; ii++){
    balls[ii].draw(ctx);
    floor.getClosestPoints(balls[ii], ctx);
  }


  requestAnimationFrame(loop);
}

var CONSTANTS = {
  gravity  : 10,
  timeStep : 1 / 30,
};

// --------------------------------

var Vector2 = function(obj) {
    var v = new Float32Array(2);

    if (obj) {

        if (arguments.length == 1) {
            v[0] = obj[0];
            v[1] = obj[1];
        } else if (arguments.length == 2) {
            v[0] = arguments[0];
            v[1] = arguments[1];
        }
    }else{
      v[0] = 0;
      v[1] = 0;
    }



    this.elements = v;
};

Vector2.prototype.copy = function() {
    var vec = new Vector2(this.elements);

    return vec;
};

Vector2.prototype.subtract = function(vec) {
    if (vec && typeof vec === 'object') {
        this.elements[0] = this.elements[0] - vec.elements[0];
        this.elements[1] = this.elements[1] - vec.elements[1];
    }

    return this;
};

Vector2.prototype.set = function(x, y) {
  this.x = x;
  this.y = y;

  return this;
}

Vector2.prototype.subtractMultipledVector = function( value, vector) {
  this.x -= value * vector.x;
  this.y -= value * vector.y;

  return this;
}

Vector2.prototype.addMultipledVector = function( value, vector) {
  this.x += value * vector.x;
  this.y += value * vector.y;

  return this;
}

Vector2.prototype.multiply = function(value) {
    if (value && typeof value === 'number') {
        this.elements[0] = this.elements[0] * value;
        this.elements[1] = this.elements[1] * value;
    }

    return this;
};

/**
* @function
* @desc add vector
*
* @param {Vector2} vec
*/

Vector2.prototype.add = function(vec) {
    if (vec && typeof vec === 'object') {
        this.elements[0] = this.elements[0] + vec.elements[0];
        this.elements[1] = this.elements[1] + vec.elements[1];
    }

    return this;
};

// =============================

/**
* @function
* @desc get the length of the vector
*
* @return {Number}
*/

Vector2.prototype.getLength = function() {
  return Math.sqrt( this.x * this.x + this.y * this.y );
}

/**
* @function
* @desc get the normalized vector
*
* @return {Vector2}
*/

Vector2.prototype.getNormal = function() {
  var length = this.getLength();
  return new Vector2( this.x / length, this.y / length );
}

/**
* @function
* @desc get the vector compare with vector of minVec to see which is smaller
*
* @param {Vector2} minVec
* @return {Vector2}
*/

Vector2.prototype.min = function( minVec ) {
  if(this.x > minVec.x) this.x = minVec.x;
  if(this.y > minVec.y) this.y = minVec.y;

  return this;
}

/**
* @function
* @desc get the vector compared with the vector of maxVector to see which is bigger
*
* @param {Vector2} maxVec
* @return {Vector2}
*/

Vector2.prototype.max = function( maxVec ) {
  if(this.x < maxVec.x) this.x = maxVec.x;
  if(this.y < maxVec.y) this.y = maxVec.y;

  return this;
}

/**
* @function
* @desc get the vector compare with vector between minVec and maxVec
*
* @param {Vector2} minVec
* @param {Vector2} maxVec
*/
Vector2.prototype.clamp = function( minVec, maxVec ) {
  return this.max(minVec).min(maxVec);
}

/**
* @function
* @desc
* @see http://mathworld.wolfram.com/RotationMatrix.html
*
* @param {Number} theta
*/

Vector2.prototype.rotate = function(theta) {
  var rotatedX = this.x * Math.cos(theta) - this.y * Math.sin(theta);
  var rotatedY = this.x * Math.sin(theta) + this.y * Math.cos(theta);

  return this.set(rotatedX, rotatedY)
};

// =============================

function Matrix () {
  this.cos = 0.0;
  this.sin = 0.0;
  this.pos = new Vector2();
  this.ang = 0.0;
}

Matrix.prototype = {
  set: function(a, x, y) {
    this.cos = Math.cos(a);
    this.sin = Math.sin(a);
    this.ang = a;
    this.pos.x = x;
    this.pos.y = y;

    return this;
  }
}

// =============================

Object.defineProperty(Vector2.prototype, 'x', {
    get: function() {
        return this.elements[0];
    },
    set: function(val) {
        this.elements[0] = val;
    }
});


Object.defineProperty(Vector2.prototype, 'y', {
    get: function() {
        return this.elements[1];
    },
    set: function(val) {
        this.elements[1] = val;
    }
});

var RigidBody = function( mass, width, height, pos, vel ) {
  //if(!instanceOf velVector) this.velVector =
  this.mass = mass;
  this.width = width;
  this.height = height;
  this.pos = pos;
  this.vel = vel;

  this.force = new Vector2(0, 0);

}

RigidBody.prototype.update = function(dt) {

  // --------------------

  //this.vel.x += this.force.x / this.mass;
  //this.vel.y += this.force.y / this.mass;

  // ====================

  this.pos.x += this.vel.x /30;
  this.pos.y += this.vel.y /30;

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

// ===============================

var Floor = function(x, y, wid, hig) {
    RigidBody.call(this, 0, wid, hig, new Vector2(x + wid/2, y + hig/2), new Vector2(0, 0));

    this.matrix = new Matrix();
    this.theta = 0;
    this.matrix.set(this.theta, 0, 0);

    this.halfExtendMinus = new Vector2( -wid/2, -hig/2 );
    this.halfExtendPlus  = new Vector2(  wid/2,  hig/2 );
}

Floor.prototype = Object.create(RigidBody.prototype);
Floor.prototype.constructor = Floor;

Floor.prototype.update = function() {
  this.theta += Math.PI/60;
}

Floor.prototype.draw = function(ctx) {
  /*
  ctx.save();
  ctx.strokeStyle = "#000000";
  ctx.beginPath();
  ctx.translate(this.pos.x, this.pos.y);
  ctx.rotate(this.theta);
  ctx.strokeRect(-this.width/2, -this.height/2, this.width, this.height);

  ctx.restore();
  */

}

Floor.prototype.debugDraw = function(ctx) {



}

Floor.prototype.getClosestPoints = function(ball, ctx) {
    var rectangelA = this;
    var ballB      = ball;

    var xPos = ballB.pos.x - rectangelA.pos.x;
    var yPos = ballB.pos.y - rectangelA.pos.y;
    var delta = new Vector2();
    delta.set(xPos, yPos);

    var rotatedDeltaX =  delta.x * this.matrix.cos + delta.y * this.matrix.sin;
    var rotatedDeltaY = -delta.x * this.matrix.sin + delta.y * this.matrix.cos;

    var rotatedVector = new Vector2( rotatedDeltaX, rotatedDeltaY );

    var dClamped = rotatedVector.clamp(this.halfExtendMinus, this.halfExtendPlus);

    var clamped  = dClamped.rotate(this.theta);
    var clamedP = this.pos.copy().add(clamped);


    var d = new Vector2( ballB.pos.x - clamedP.x, ballB.pos.y - clamedP.y);
    var n = d.getNormal();

    var na = clamedP;
    var pb = ballB.pos.copy().subtractMultipledVector(ballB.radius, n);

    var dist = d.getLength() - ballB.radius;


    ctx.fillStyle = "rgba(0, 0, 0, .1)";
    ctx.beginPath();

    ctx.arc( clamedP.x, clamedP.y, 2, 0, 2 * Math.PI);
    ctx.fill()

    opacity = .2 * (1 - dist/500);
    if(opacity < 0) opacity = 0;
    ctx.strokeStyle = "rgba(0, 0, 0, " + opacity + ")";
    ctx.beginPath();
    ctx.moveTo( clamedP.x, clamedP.y);
    ctx.lineTo( clamedP.x + d.x, clamedP.y + d.y);
    ctx.stroke();

};

// -------------------------------------

var Ball = function( _mass, _rad, _pos, _vel ) {
  RigidBody.call(this, _mass, _rad, _rad, _pos, _vel);
  this.radius = _rad;

};

Ball.prototype = Object.create(Ball.prototype);
Ball.prototype.constructor = Ball;


Ball.prototype.update = function( dt ) {

  RigidBody.prototype.update.call(this, dt);

}

Ball.prototype.draw = function(ctx) {
  this.changePosAndVel()
};

Ball.prototype.changePosAndVel = function() {
  if(this.vel.x > 0){
    if(this.pos.x > window.innerWidth + 0){
      this.pos.x = -50 - 50 * Math.random();
      this.pos.y = window.innerHeight * Math.random();
    }

  }else if(this.vel.x < 0){
    if(this.pos.x < 0){
      this.pos.x = window.innerWidth + 50 * Math.random();
      this.pos.y = window.innerHeight * Math.random();
    }

  }else if(this.vel.y > 0){
    if(this.pos.y > window.innerHeight + 50){
      this.pos.x = window.innerWidth * Math.random();
      this.pos.y = -50 - 50 * Math.random();
    }

  }else if(this.vel.y < 0){
    if(this.pos.y < 0){
      this.pos.x = window.innerWidth * Math.random();
      this.pos.y = window.innerHeight + 50 + 50 * Math.random();
    }

  }
}

Ball.prototype.getClosestPoints = function(rBody) {
  var contacts;
  var ballA = this;

  if(rBody instanceof Ball){

    var ballB = rBody;

    var delata = new Vector2( ballA.x - ballB.x, ballA.y - ballB.y );
    var n;

    if( delata.getLength() ){
      n = delata.getNormal();
    }else{
      n = new Vector2(1, 0);
    }

    // generate closes points
    var pa = new Vector2();
    pa.x = ballA.pos.x + n.x * this.radius;
    pa.y = ballA.pos.y + n.y * this.radius;

    var pb = new Vector2();
    pb.x = ballB.pos.x - n.x * this.radius;
    pb.y = ballB.pos.y - n.y * this.radius;

    // getdistance
    var dist = delata.getLength() - (ballA.radius + ballB.radius);

  }else if(rBody instanceof Floor){
    var rectangleB = rBody;
  }else{
    console.error("===== NO getClosestPoints IN Ball =====");
  }

  return contacts;
}

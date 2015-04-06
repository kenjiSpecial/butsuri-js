var ctx;
var floor;
var rotatingFloor;
var mObjects = [];

// --------------------------------

var CONSTANTS = {
  gravity  : 10,
  timeStep : 1 / 30,
};

// --------------------------------

window.onload = function(){
  var canvas = document.getElementById('c');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  ctx = canvas.getContext('2d');

  rotatingFloor = new Floor( window.innerWidth /2- 40, 100, 60, 20);
  mObjects.push(rotatingFloor);

  floor = new Floor( window.innerWidth/2 - 200, window.innerHeight - 60, 400, 20);
  mObjects.push(floor);

  var floor1 = new Floor( window.innerWidth/2 - 200, window.innerHeight/2 + 60, 200, 40)
  floor1.angle = Math.PI / 12;
  mObjects.push(floor1);

  var floor2 = new Floor( window.innerWidth/2 , window.innerHeight/2 - 150, 200, 40)
  floor2.angle = -Math.PI / 12;
  mObjects.push(floor2);

  function add(){
    var boxWid = 30 + parseInt(70 * Math.random());
    var boxHig = 30 + parseInt(70 * Math.random());
    var yPos = - 50 - boxHig;
    var xPos = window.innerWidth/2 - 50 + 100 * Math.random();
    var box = new Box( boxWid*boxHig, xPos, yPos, boxWid, boxHig);
    box.angle = Math.random() * Math.PI;
    //console.log(box);
    mObjects.push(box)

    if(mObjects.length < 12) setTimeout(add, 750);
  }

  add();

  loop();
}

function loop () {
  var dt = CONSTANTS.timeStep;

  rotatingFloor.loopRotation();
  floor.loopMovement(dt)

  for(var ii in this.mObjects){
    //console.log(mObjects[ii]);
    mObjects[ii].update(dt);
  }

  // ---------------
  generateMotionBounds(dt);
  // ---------------

  this.contacts = this.collide();
  solver(this.contacts);

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

  for(var ii in mObjects){
    mObjects[ii].draw(ctx);
  }


  requestAnimationFrame(loop);
}

function generateMotionBounds(dt) {
  for(var ii in mObjects){
    mObjects[ii].generateMotionAABB(dt);
  }
}

function collide(){
  var contacts = [];

  for (var ii = 0; ii < this.mObjects.length - 1; ii++) {
    var rigidBodyA = this.mObjects[ii];
    for(var jj = ii + 1; jj < this.mObjects.length; jj++){
      var rigidBodyB = this.mObjects[jj];

      if( rigidBodyA.mass != 0 || rigidBodyB.mass != 0 ){
        if(AABB.overlap(rigidBodyA.motionBounds, rigidBodyB.motionBounds)){
            var _contacts = rigidBodyA.getClosestPoints(rigidBodyB);
            contacts = contacts.concat(_contacts);
        }
      }
    }
  }

  return contacts;
}

// --------------------------------
/**
 * Constructor
 */
var Vector2 = function(xx, yy) {
  this.x = xx || 0;
  this.y = yy || 0;
};

Vector2.prototype.copy = function() {
    var vec = new Vector2(this.x, this.y);

    return vec;
};

Vector2.prototype.subtract = function(vec) {
    this.x = this.x - vec.x;
    this.y = this.y - vec.y;

    return this;
};

Vector2.prototype.set = function(x, y) {
  this.x = x;
  this.y = y;

  return this;
};

Vector2.prototype.subtractMultipledVector = function( value, vector) {
  this.x -= value * vector.x;
  this.y -= value * vector.y;

  return this;
};

Vector2.prototype.addMultipledVector = function( value, vector) {
  this.x += value * vector.x;
  this.y += value * vector.y;

  return this;
};

Vector2.prototype.multiply = function(value) {

    this.x = this.x * value;
    this.y = this.y * value;

    return this;
};

/**
 *
 * @param {Vector2} value
 * @return {Vector2}
 */

Vector2.prototype.divide = function(value){
    this.x = this.x / value;
    this.y = this.y / value;

    return this
};


/**
* @function
* @desc add vector
*
* @param {Vector2} vec
*/

Vector2.prototype.add = function(vec) {

    this.x = this.x + vec.x;
    this.y = this.y + vec.y;

    return this;
};

/**
 * @function
 * @param {Vector2} theta
 * @return {Vector2}
 */

Vector2.prototype.fromAngle = function(theta){
    this.x = Math.cos(theta);
    this.y = Math.sin(theta);

    return this;
};


/**
 * @function
 * @return {Vector2}
 */
Vector2.prototype.perp = function(){
    return new Vector2( -this.y, this.x );
};

// =============================

/**
* @function
* @desc get the length of the vector
*
* @return {Number}
*/

Vector2.prototype.getLength = function() {
  return Math.sqrt( this.getSquareLength() );
};

/**
 *
 * @return {Number}
 */
Vector2.prototype.getSquareLength = function() {
  return this.dotProduct(this);
};

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


/**
* @function
* @see http://en.wikipedia.org/wiki/Dot_product
*
* @param  {Vector2} vec
* @return {Number}
*/

Vector2.prototype.dotProduct = function(vec) {
  return this.x * vec.x + this.y * vec.y;
};

/**
 *
 * @return {Vector2}
 */
Vector2.prototype.abs = function(){
    return new Vector2(Math.abs(this.x) + Math.abs(this.y));
};

// ============================

var Matrix = function(){
  this.angle = 0;
  this.row0 = new Vector2(1, 0);
  this.row1 = new Vector2(0, 1);
  this.pos  = new Vector2();
};


/**
* @param {Number} angle
*/

Matrix.prototype.setAngle = function( angle ) {
  this.angle = angle;
  this.row0 = this.row0.fromAngle(angle);
  this.row1 = this.row0.perp();
}


/**
* @param {Number} angle
* @param {Vector2} pos
*/
Matrix.prototype.setAngleAndPos = function( angle, pos) {
  this.setAngle(angle);
  this.pos  = pos;
};

// this.row0 = (cos(theta), sin(theta));
// this.row1 = (-sin(theta), cos(theta));

/**
* @param {Vector2} v
* @return {Vector2}
*/

Matrix.prototype.RotateIntoSpaceOf = function( v ) {
  return new Vector2(v.copy().dotProduct(this.row0), v.copy().dotProduct(this.row1));
};

/**
* @param {Vector2}
* @return {Vector2}
*/

Matrix.prototype.rotateBy = function( v ) {
  var vec0 = this.row0.copy().multiply(v.x);
  var vec1 = this.row1.copy().multiply(v.y);

  return vec0.add(vec1);
};

/**
* @param {Vector2} vec
* @return {Vector2}
*/
Matrix.prototype.transformBy = function(vec) {
  return this.rotateBy(vec).add(this.pos);
};


// =============================

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

  this.matrix = new Matrix();

  this.width = width;
  this.height = height;

  this.angle = 0;
  this.angularVel = 0;

  this.pos = pos;
  this.vel = vel;

  this.force = new Vector2(0, 0);
}

RigidBody.prototype.update = function(dt) {

  // --------------------
  this.angle += this.angularVel * dt;

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
};

RigidBody.prototype.generateMotionAABB = function(dt) {

};

Object.defineProperty(RigidBody.prototype, "pos", {
  get : function() {
    return this.matrix.pos;
  },

  set : function(vector) {
    this.matrix.pos = vector;
  }
});

Object.defineProperty(RigidBody.prototype, 'angle', {
  get : function(){
    return this.matrix.angle;
  },

  set : function(angle) {
    this.matrix.setAngle(angle);
  }

});

// ===============================

var Geometry = {
  type : {
    'vertexAFaceB' : 0,
    'vertexBFaceA' : 1
  },

  /**
  * @param {Vector2} p
  * @param {Vector2} e0
  * @param {Vector2} e1
  */
  projectPointOntoEdge : function(p, e0, e1){
    var v = p.copy().subtract(e0);
    var e = e1.copy().subtract(e0);

    var t = e.dotProduct(v) / e.getSquareLength();

    t = Math.max(Math.min(1, t), 0);

    return e0.copy().addMultipledVector(t, e);
  },

  /**
  * @param {Number} dist
  * @param {Number} centerDist
  * @param {Number} edge
  * @param {Number} supportV
  * @param {Number} fpc
  * @param {Object} mostSeparated
  * @param {Object} mostPenetrating
  * @param {Vector2} e0
  * @param {Vector2} e1
  */
  featurePairJudgement : function( dist, centerDist, edge, supportV, fpc, most, e0, e1 ) {

    var mostSeparated = most.mostSeparated;
    var mostPenetrating = most.mostPenetrating;

    if(dist > 0){
        var p = this.projectPointOntoEdge(new Vector2(), e0, e1);
        dist = p.getLength();
        //console.log(dist);

        if(dist < mostSeparated.dist){
          mostSeparated = { dist: dist, vertex: supportV, face: edge, fp: fpc, centerDist: centerDist}
        }else if(dist == mostSeparated.dist && fpc == mostSeparated.fp){
            if(centerDist < mostSeparated.centerDist){
              mostSeparated = {dist: dist, vertex: supportV, face: edge, fp: fpc, centerDist: centerDist}
            }
        }
    }else{
      //
      if(dist > mostPenetrating.dist){
        mostPenetrating =  { dist: dist, vertex: supportV, face: edge, fp: fpc, centerDist: centerDist}
      }else if(dist == mostPenetrating.dist && fpc == mostPenetrating.fp){
        // got to the pick the right one - pick one closest to center of A
        if(centerDist < mostPenetrating.centerDist){
          mostPenetrating =  { dist: dist, vertex: supportV, face: edge, fp: fpc, centerDist: centerDist}
        }
      }
    }

    return {'mostSeparated' : mostSeparated, 'mostPenetrating' : mostPenetrating};;
  },

  /**
  * @param {Rectangle} rectangleA
  * @param {Rectangle} rectangleB
  */
  rectRectClosestPoints : function( rectangleA, rectangleB ) {
    var contacts = [];

    var mostSeparated = {
      dist   : 99999,
      vertex : -1,
      face   : -1,
      fp     : null,
      centerDist : 99999
    };

    var mostPenetrating = {
      dist   : -99999,
      vertex : -1,
      face   : -1,
      fp     : null,
      centerDist : 99999
    }

    for (var ii = 0; ii < rectangleA.localSpacePoints.length; ii++) {
      ///rectangleA.localSpacePoints[ii]
      var wsN  = rectangleA.getWorldSpaceNormal(ii);
      var wsV0 = rectangleA.getWorldSpacePoint(ii);
      var wsV1 = rectangleA.getWorldSpacePoint((ii + 1) % rectangleA.localSpacePoints.length);
      /*
      if(ii == 0){
        console.log(wsV0);
        console.log(wsV1);
      } */

      //console.log(wsV1)

      // get supporting vertices of B
      var s = rectangleB.getSupportVertices(wsN.copy().multiply(-1));

      // console.log(s[0]);

      for(var jj = 0; jj < s.length; jj++){
        //var m
        var mfp0 = s[jj].mV.copy().subtract(wsV0);
        var mfp1 = s[jj].mV.copy().subtract(wsV1);
        //if(ii == 0)console.log(wsN);

        // distance from the origin of the face
        var dist = mfp0.dotProduct(wsN);
        //if(ii == 2) console.log('dist: ' + dist);

        // distance to the center of A
        var centerDist = s[jj].mV.copy().subtract(rectangleA.pos).getSquareLength();

        //console.log(s[jj].mV.copy().subtract(rectangleA.pos));
        //console.log(dist);
        //console.log(centerDist);
        //console.log(mfp1);

        if(ii == 0) window.distA  = dist;

        var most = this.featurePairJudgement(dist, centerDist, ii, s[jj].mI,this.type.vertexBFaceA, { 'mostSeparated' : mostSeparated, 'mostPenetrating' : mostPenetrating}, mfp0, mfp1);
        //console.log(most.mostSeparated);
        mostSeparated = most.mostSeparated;
        mostPenetrating = most.mostPenetrating;
        //console.log(mostPenetrating);
        //console.log('\n');
      }
    }

    //console.log('\n');
    //console.log(mostSeparated);

    for(var ii = 0; ii < rectangleB.localSpacePoints.length; ii++){

      var wsN  = rectangleB.getWorldSpaceNormal(ii);
      var wsV0 = rectangleB.getWorldSpacePoint(ii);
      var wsV1 = rectangleB.getWorldSpacePoint((ii + 1)%rectangleB.localSpacePoints.length);

      var s = rectangleA.getSupportVertices(wsN.copy().multiply(-1));

      for(var jj = 0; jj < s.length; jj++){
        var mfp0 = s[jj].mV.copy().subtract(wsV0);
        var mfp1 = s[jj].mV.copy().subtract(wsV1);

        // distance from the origin of the face
        var dist = mfp0.dotProduct(wsN);

        // distance to the center of A
        var centerDist = s[jj].mV.copy().subtract(rectangleB.pos).getSquareLength();
        //window.distB = dist;
        //console.log(this.type.vertexBFaceA);

        var most = this.featurePairJudgement(dist, centerDist, ii, s[jj].mI,this.type.vertexAFaceB, { 'mostSeparated' : mostSeparated, 'mostPenetrating' : mostPenetrating}, mfp0, mfp1);
        mostSeparated = most.mostSeparated;
        mostPenetrating = most.mostPenetrating;
      }
    }


    var featureToUse;
    var vertexRect, faceRect;
    if(mostSeparated.dist > 0 && mostSeparated.fp != null){
      featureToUse = mostSeparated;
    }else if(mostPenetrating.dist <= 0){
      featureToUse = mostPenetrating;
    }else{
      console.error('RectRectClosestPoints(): Impossible condition!');
    }

    if(featureToUse.fp == this.type.vertexAFaceB){
      vertexRect = rectangleA;
      faceRect   = rectangleB;
    }else{
      //console.log('type.vertexBFaceA');
      vertexRect = rectangleB;
      faceRect   = rectangleA;
    }

    // console.log('vertexRect');
    // console.log(vertexRect);
    // console.log('\n');
    // console.log('faceRect');
    // console.log(faceRect);
    // console.log('\n');

    var worldN = faceRect.getWorldSpaceNormal(featureToUse.face);

    // console.log('worldN');
    // console.log(worldN);
    // console.log('\n');


    // other vertex adjcent which makes most parallel normal with the collision normal
    var worldV = vertexRect.getSecondSupport( featureToUse.vertex, worldN);
    //console.log(worldV);

    // world space edge
    var worldEdge0 = faceRect.getWorldSpacePoint( featureToUse.face );
    window.faceRect = faceRect
    //console.log(faceRect);
    var worldEdge1 = faceRect.getWorldSpacePoint( (featureToUse.face+1)%faceRect.localSpacePoints.length );

    window.worldEdge0 = worldEdge0;
    window.worldEdge1 = worldEdge1;


    // console.log('\n');
    // console.log( (featureToUse.face+1)%faceRect.localSpacePoints.length);
    // console.log(worldEdge0);
    // console.log(worldEdge1);
    // console.log('\n');

    // console.log('worldEdge0: ');
    // console.log(worldEdge0);
    // console.log('\n');
    // console.log('worldEdge1: ');
    // console.log(worldEdge1);
    // console.log('\n');

    var pointsOnRectangleA = [];
    var pointsOnRectangleB = [];

    //console.log(worldN);
    if(featureToUse.fp == this.type.vertexAFaceB){
      pointsOnRectangleA[0] = this.projectPointOntoEdge( worldEdge0, worldV[0], worldV[1]);
      pointsOnRectangleA[1] = this.projectPointOntoEdge( worldEdge1, worldV[0], worldV[1]);

      pointsOnRectangleB[0] = this.projectPointOntoEdge( worldV[1], worldEdge0, worldEdge1);
      pointsOnRectangleB[1] = this.projectPointOntoEdge( worldV[0], worldEdge0, worldEdge1);

      worldN.multiply(-1);
    }else{
      pointsOnRectangleB[0] = this.projectPointOntoEdge( worldEdge0, worldV[0], worldV[1]);
      pointsOnRectangleB[1] = this.projectPointOntoEdge( worldEdge1, worldV[0], worldV[1]);

      pointsOnRectangleA[0] = this.projectPointOntoEdge( worldV[1], worldEdge0, worldEdge1);
      pointsOnRectangleA[1] = this.projectPointOntoEdge( worldV[0], worldEdge0, worldEdge1);
    }


    window.pointA = pointsOnRectangleA;
    window.pointB = pointsOnRectangleB

    /**
    console.log(worldV);
    console.log(worldEdge0);
    console.log(worldEdge1);
    console.log('\n');
    console.log(pointsOnRectangleA[0]);
    console.log(pointsOnRectangleB[0]);
    console.log('\n');
    console.log(pointsOnRectangleA[0]);
    console.log(pointsOnRectangleB[0]);
    console.log('\n\n');
    */

    var d0 = pointsOnRectangleB[0].copy().subtract(pointsOnRectangleA[0]).dotProduct(worldN);
    var d1 = pointsOnRectangleB[1].copy().subtract(pointsOnRectangleA[1]).dotProduct(worldN);

    //console.log(d0);
    //console.log(d1);
    //console.log(d0);

    var contacts = [];
    contacts.push(new Contact(rectangleA, rectangleB, pointsOnRectangleA[0], pointsOnRectangleB[0], worldN, d0 ));
    contacts.push(new Contact(rectangleA, rectangleB, pointsOnRectangleA[1], pointsOnRectangleB[1], worldN, d1 ));

    //window.contacts = contacts;
    //console.log(contacts[0].Dist);
    //console.log('\n');



    return contacts;

  }

};

// ===============================

var Rectangle = function(mass, x, y, wid, hig) {

    RigidBody.call(this, mass, wid, hig, new Vector2(x + wid/2, y + hig/2), new Vector2(0, 0));

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

  ctx.beginPath();
  ctx.moveTo(-4, 0);
  ctx.lineTo( 4, 0);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo( 0, -4 );
  ctx.lineTo( 0,  4 );
  ctx.stroke();


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


// ===============================

var Floor = function( x, y, wid, hig){
    Rectangle.call(this, 0, x, y, wid, hig);
    this.time = 0;
};

Floor.prototype = Object.create(Rectangle.prototype);
Floor.prototype.constructor = Floor;

Floor.prototype.loopMovement = function(dt) {
  this.time += dt;

  this.pos.x = window.innerWidth/2 + 200 * Math.sin(this.time/2);
}

Floor.prototype.loopRotation = function() {
  this.angle += .02;
}


// ===============================

var Box = function( mass, x, y, wid, hig ) {
    Rectangle.call(this, mass, x, y, wid, hig);

    this.halfWidth = this.width/2;
    this.halfHeight = this.height/2;
};

Box.prototype = Object.create(Rectangle.prototype);
Box.prototype.constructor = Box;

Box.prototype.update = function(dt) {
  Rectangle.prototype.setGravity.call(this);

  this.vel.x += this.force.x * this.invMass;
  this.vel.y += this.force.y * this.invMass;

  Rectangle.prototype.update.call(this, dt);
}

Box.prototype.draw = function(ctx) {

  ctx.save();

  ctx.strokeStyle = "#ffffff";
  ctx.fillStyle = "#000";

  ctx.translate(this.pos.x, this.pos.y);
  ctx.rotate(this.angle);

  ctx.beginPath();
  ctx.fillRect(-this.halfWidth, -this.halfHeight, this.width, this.height);

  ctx.beginPath();
  ctx.moveTo( -this.halfWidth, -this.halfHeight )
  ctx.lineTo(  this.halfWidth,  this.halfHeight );
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(  this.halfWidth, -this.halfHeight );
  ctx.lineTo( -this.halfWidth,  this.halfHeight );
  ctx.stroke();

  ctx.restore();

  if(this.pos.y > window.innerHeight + Math.sqrt(this.width * this.width + this.height * this.height)*2 ){
    this.reset()
  }

};

Box.prototype.reset = function() {
  console.log('reset');
  var yPos = - 50 - this.height;
  var xPos = window.innerWidth/2 - 50 + 100 * Math.random();

  this.pos.set(xPos, yPos)
  this.vel.set(0, 0);

  this.angle = Math.PI * Math.random();
  this.angularVel = 0;
};

// -------------------------------------



// -------------------------------------

var Ball = function( _mass, _rad, _pos, _vel ) {
  RigidBody.call(this, _mass, _rad, _rad, _pos, _vel)
  this.radius = _rad;

};

Ball.prototype = Object.create(Ball.prototype);
Ball.prototype.constructor = Ball;


Ball.prototype.update = function( dt ) {

  RigidBody.prototype.setGravity.call(this);
  RigidBody.prototype.update.call(this, dt);

}

Ball.prototype.draw = function(ctx) {

  ctx.fillStyle = "#000000"
  ctx.beginPath();
  ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
  ctx.fill();


  if(this.pos.x > window.innerWidth + this.radius * 2 || this.pos.x < 0 - this.radius * 2 || this.pos.y + this.radius*2 > window.innerHeight + this.rad * 2){
    this.reset();
  }
};

Ball.prototype.reset = function() {
  this.pos = new Vector2(window.innerWidth/2 - 100 + 200 * Math.random(), -this.radius * 2 - 400 * Math.random());
  this.vel = new Vector2();
}

Ball.prototype.getClosestPoints = function(rBody) {
  var contacts = [];
  var ballA = this;

  if(rBody instanceof Ball){

    var ballB = rBody;

    var delata = new Vector2( ballB.pos.x - ballA.pos.x, ballB.pos.y - ballA.pos.y );
    var n;

    if( delata.getLength() ){
      n = delata.getNormal();
    }else{
      n = new Vector2(1, 0);
    }

    // generate closes points
    var pa = new Vector2();
    pa.x = ballA.pos.x + n.x * ballA.radius;
    pa.y = ballA.pos.y + n.y * ballA.radius;

    var pb = new Vector2();
    pb.x = ballB.pos.x - n.x * ballB.radius;
    pb.y = ballB.pos.y - n.y * ballB.radius;

    // getdistance
    var dist = delata.getLength() - (ballA.radius + ballB.radius);

    contacts.push(new Contact( ballA, ballB, pa, pb, n, dist ));

  }else if(rBody instanceof Floor){
    var rectangleB = rBody;

    contacts = rectangleB.getClosestPoints(this);
    utils.flipContacts(contacts);

  }else{
    console.error("===== NO getClosestPoints IN Ball =====");
  }

  return contacts;
}

// ================================

var utils = {
  /**
  *
  * @param {Contact[]} contacts
  */
  flipContacts : function(contacts) {
      for (var ii = 0; ii < contacts.length; ii++) {

        var tempB = contacts[ii].B
        contacts[ii].B = contacts[ii].A;
        contacts[ii].A = tempB;

        var tempPb = contacts[ii].Pb;
        contacts[ii].Pb = contacts[ii].Pa;
        contacts[ii].Pa = tempPb;

        var tempV = contacts[ii].rb;
        contacts[ii].rb = contacts[ii].ra;
        contacts[ii].ra = tempV;

        contacts[ii].normal.x *= -1;
        contacts[ii].normal.y *= -1;
      }
  }
};

// ================================

var AABB = function() {};

/**
 * @param {Vector2} mCenter
 * @param {Vector2} mHalfExtents
 */
AABB.prototype.setVector = function(mCenter, mHalfExtents) {
    this.mCenter = mCenter;
    this.mHalfExtents = mHalfExtents;
};

/**
 * @param {AABB} a
 * @param {AABB} b
 */
AABB.prototype.setAABB = function(a, b) {
    var minVectorA = a.mCenter.copy().subtract(a.mHalfExtents);
    var maxVectorA = a.mCenter.copy().add(a.mHalfExtents);

    var minVectorB = b.mCenter.copy().subtract(b.mHalfExtents);
    var maxVectorB = b.mCenter.copy().add(b.mHalfExtents);

    var minVector = minVectorA.copy().min(minVectorB);
    var maxVector = maxVectorA.copy().max(maxVectorB);

    this.mCenter = minVector.copy().add(maxVector).divide(2);
    this.mHalfExtents = maxVector.copy().subtract(minVector).divide(2);
}

/**
 * @param {AABB} a
 * @param {AABB} b
 * @return {bool}
 */

AABB.overlap = function(a, b) {

    var aMaxX = a.mCenter.x + a.mHalfExtents.x
    var aMinX = a.mCenter.x - a.mHalfExtents.x

    var aMaxY = a.mCenter.y + a.mHalfExtents.y
    var aMinY = a.mCenter.y - a.mHalfExtents.y

    // ----------------------------------------

    var bMaxX = b.mCenter.x + b.mHalfExtents.x
    var bMinX = b.mCenter.x - b.mHalfExtents.x

    var bMaxY = b.mCenter.y + b.mHalfExtents.y
    var bMinY = b.mCenter.y - b.mHalfExtents.y

    if(aMaxX < bMinX || aMinX > bMaxX) return false;
    if(aMaxY < bMinY || aMinY > bMaxY) return false;

    return true;
}

/**
 * @param {Vector2[]} points
 * @param {Matrix23}  m
 */
AABB.buildAABB = function(points, m) {


    var minVec = new Vector2(99999, 99999);
    var maxVec = new Vector2(-99999, -99999);

    for (var ii = 0; ii < points.length; ii++) {
        minVec = m.transformBy(points[ii]).min(minVec);
        maxVec = m.transformBy(points[ii]).max(maxVec);
    }


    var aabbCenter = minVec.copy().add(maxVec).divide(2);
    var aabbHalfExtents = maxVec.copy().subtract(minVec).divide(2);

    var aabb = new AABB();
    aabb.setVector(aabbCenter, aabbHalfExtents);

    return aabb;

};

// ================================

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

  var c = ran * ran * A.invI;
  var d = rbn * rbn * B.invI;


  this.invDenom = 1 / (aInvMass + bInvMass + c + d);

};

Contact.prototype = {
  /**
  * @param {Vector2} imp
  */
  applyImpulses : function(imp) {

    this.A.vel.addMultipledVector(this.A.invMass, imp);
    /*
    console.log('imp');
    console.log(imp);
    console.log('vel');
    console.log(this.B.vel); */
    this.B.vel.subtractMultipledVector(this.B.invMass, imp);

    this.A.angularVel += imp.dotProduct(this.ra) * this.A.invI;
    this.B.angularVel -= imp.dotProduct(this.rb) * this.B.invI;
  },

  /**
  * @return {Vector2}
  */

  getVelPa : function() {
    return this.A.vel.copy().addMultipledVector(this.A.angularVel, this.ra);
  },

  /**
  * @return {Vector2}
  */

  getVelPb : function() {
    return this.B.vel.copy().addMultipledVector(this.B.angularVel, this.rb);
  },

  draw : function(ctx) {
    ctx.fillStyle = "#0000ff";

    ctx.beginPath();
    ctx.arc(this.A.pos.x, this.A.pos.y, 3, 0, 2 * Math.PI );
    ctx.fill();

    ctx.beginPath();
    ctx.arc(this.B.pos.x, this.B.pos.y, 3, 0, 2 * Math.PI );
    ctx.fill();

    ctx.fillStyle = "#009900";
    ctx.beginPath();
    ctx.arc(this.Pa.x, this.Pa.y, 2, 0, 2 * Math.PI );
    ctx.fill();

    ctx.beginPath();
    ctx.arc(this.Pb.x, this.Pb.y, 2, 0, 2 * Math.PI );
    ctx.fill();


    ctx.strokeStyle = "#0000ff";
    ctx.beginPath();
    ctx.moveTo(this.Pa.x, this.Pa.y);
    ctx.lineTo(this.Pa.x + this.ra.x, this.Pa.y + this.ra.y  );
    ctx.stroke();

    ctx.strokeStyle = "#0000ff";
    ctx.beginPath();
    ctx.moveTo(this.Pb.x, this.Pb.y);
    ctx.lineTo(this.Pb.x + this.rb.x, this.Pb.y + this.rb.y  );
    ctx.stroke();


    //ctx.moveTo(this.Pa.x, )

  }

};


// ================================

var numInteraction = 5;
var solveType;

var solver = function(contacts) {
    for (var jj = 0; jj < numInteraction; jj++) {
        for (var ii = 0; ii < contacts.length; ii++) {
            var con = contacts[ii];
            var n = con.normal;
            var relNv = con.getVelPb().subtract(con.getVelPa()).dotProduct(n);

            speculativeSolver(con, n, relNv);

        }
    }
}

function speculativeSolver(con, n, relNv) {
    var remove = relNv +   con.Dist / CONSTANTS.timeStep;

    if (remove < 0) {
        var mag = remove *  con.invDenom;
        var imp = n.copy().multiply(mag );

        con.applyImpulses(imp);
    }
}

/**
*/
function discreteSolver ( con, n, relNv ) {
  var remove = relNv + .4 * (con.Dist + 1) / CONSTANTS.timeStep;

  if(con.mDist < 0 && remove < 0){

    var mag = remove / (con.A.invMass + con.B.invMass);
    var imp = con.normal.copy().multiply(mag);

    con.applyImpulses(imp);
  }
}

function discreteSequential(con, n, relNv){
  if(con.mDist < 0){
    var remove = relNv + .4 * (con.mDist + 1) / CONSTANTS.timeStep;

    var mag = remove / (con.mA.invMass + con.mB.invMass);
    var newImpulse = Math.min(mag + con.mImpulse, 0)
    var change = newImpulse - con.mImpulse;

    var imp = con.normal.copy().multiply(change);

    con.applyImpulses(imp);

    con.mImpulse = newImpulse;
  }
}

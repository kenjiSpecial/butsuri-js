var Vector2 = require('ks-vector').Vector2;

var AABB = function(){
};

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
AABB.prototype.setAABB = function( a, b) {
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

AABB.prototype.overlap = function(a, b) {
  var d = b.mCenter.copy().subtract(a.mCenter).abs().subtract(a.mHalfExtents.copy().add(b.mHalfExtents));
  return d.x < 0 & d.y;
}

/**
* @param {Vector2[]} points
* @param {Matrix23}  m
*/
AABB.prototype.buildAABB = function(points, m) {
  var minVec = m.transformBy(points[0]);
  var maxVec = m.transformBy(points[0]);

  if(points.length > 0){
    for (var ii = 1; ii < point.length; ii++) {
      var vec = point[ii];
      var transformedVec0 = m.transformBy(vec);
      var transformedVec1 = transformedVec0.copy();
      minVec = transformedVec0.min(minVec);
      maxVec = transformedVec1.max(maxVec);
    }

    var aabbCenter = minVec.copy().add(maxVec).divide(2);
    var aabbHalfExtents = maxVec.copy().subtract(minVec).divide(2);

    var aabb = new AABB();
    aabb.setVector( aabbCenter, aabbHalfExtents );

    return aabb;
  }

};

module.exports = AABB;

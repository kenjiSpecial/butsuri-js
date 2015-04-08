var Vector2 = require('ks-vector').Vector2;

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

module.exports = AABB;

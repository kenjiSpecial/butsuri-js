var numInteraction = 1;
var solveType;

var CONSTANTS = require('./constants.js');

var solver = function(contacts) {
    for (var jj = 0; jj < numInteraction; jj++) {
        for (var ii = 0; ii < contacts.length; ii++) {
            var con = contacts[ii];
            var n = con.mNormal;

            var relNv = con.mB.vel.copy().subtract(con.mA.vel.copy()).dotProduct(n);

            speculativeSolver(con, n, relNv);

        }
    }
}

function speculativeSolver(con, n, relNv) {
    var remove = relNv +   con.mDist / CONSTANTS.timeStep;

    if (remove < 0) {

        var mag = remove / (con.mA.invMass + con.mB.invMass);
        if(con.mA.invMass == 0 || con.mB.invMass == 0) mag *= 1.25;
        var imp = con.mNormal.copy().multiply(mag);

        con.applyImpulses(imp);
    }
}

/**
*/
function discreteSolver ( con, n, relNv ) {
  var remove = relNv + .4 * (con.mDist + 1) / CONSTANTS.timeStep;

  if(con.mDist < 0 && remove < 0){

    var mag = remove / (con.mA.invMass + con.mB.invMass);
    var imp = con.mNormal.copy().multiply(mag);

    con.applyImpulses(imp);
  }
}

function discreteSequential(con, n, relNv){
  if(con.mDist < 0){
    var remove = relNv + .4 * (con.mDist + 1) / CONSTANTS.timeStep;

    var mag = remove / (con.mA.invMass + con.mB.invMass);
    var newImpulse = Math.min(mag + con.mImpulse, 0)
    var change = newImpulse - con.mImpulse;

    var imp = con.mNormal.copy().multiply(change);

    con.applyImpulses(imp);

    con.mImpulse = newImpulse;

  }
}


module.exports = solver;

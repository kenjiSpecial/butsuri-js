var numInteraction = 5;
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
        var imp = con.mNormal.copy().multiply(mag);

        con.applyImpulses(imp);
    }
}

/**
*/
function discreteSolver ( con, n, relNv ) {
  var remove = relNv + 1.1 * (con.mDist + 1) / CONSTANTS.timeStep;

  if(remove < 0){
    var mag = remove / (con.mA.invMass + con.mB.invMass);
    var imp = con.mNormal.copy().multiply(mag);

    con.applyImpulses(imp);
  }
}


module.exports = solver;

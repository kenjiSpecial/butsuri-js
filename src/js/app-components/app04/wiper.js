var Vector2 = require('ks-vector').Vector2;
var CONSTANTS = require('../../components/constants.js');
var WiperRectangle = require('./wiper-rectangle.js');
var TweenLite = require('gsap');;

var Wiper = function( objects ){
    var size = Math.min(window.innerHeight, window.innerWidth );

    var bigSize = size  / 2;
    var bigRectangle = new WiperRectangle( window.innerWidth/2, window.innerHeight - 40, bigSize + 40, 40 );
    bigRectangle.isBig = true;
    this.bigRectangle = bigRectangle;

    var smallSize = size / 6;
    var smallRectangle = new WiperRectangle( window.innerWidth/2, window.innerHeight - 40, smallSize +40, 40 );
    smallRectangle.parentRectangle = bigRectangle;
    this.smallRectangle = smallRectangle;

    objects.push(bigRectangle);
    objects.push(smallRectangle);
};

module.exports = Wiper;

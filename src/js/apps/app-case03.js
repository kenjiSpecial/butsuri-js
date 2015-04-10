var Ball = require('../app-components/app03/ball');
var Floor = require('../components/floor.js');
var Plane = require('../components/plane');
var Box = require('../components/box.js');
var AABB = require('../components/aabb.js');

var Vector2 = require('ks-vector').Vector2;
var CONSTANTS = require('../components/constants.js');
var solver = require('../components/solver.js');
var TweenLite = require('gsap');;
var cw, ch;


var App = function () {
    this.loop = this.loop.bind(this);
    this.canvas = document.getElementById('c');
    cw = window.innerWidth;
    ch = window.innerHeight;
    this.canvas.width = cw;
    this.canvas.height = ch;

    this.ctx = this.canvas.getContext('2d');

    this.mObjects = [];
    this.balls = [];

    var plane = new Plane(window.innerWidth / 2, window.innerHeight, window.innerWidth);
    this.mObjects.push(plane)

    var plane = new Plane(0, window.innerHeight / 2, window.innerHeight);
    plane.angle = Math.PI / 2;
    this.mObjects.push(plane);

    var plane = new Plane(window.innerWidth, window.innerHeight / 2, window.innerHeight);
    plane.angle = Math.PI / 2;
    this.mObjects.push(plane);

    var ball = new Ball(100, 40, new Vector2(window.innerWidth / 2, 0), new Vector2(0, 100));
    this.balls.push(ball)
    this.mObjects.push(ball);

    setTimeout(this.loop, 1000);




    this.count = 0;
};

App.prototype.loop = function () {
    this.add();




    this.count++;



    if(this.count > 12) return;
    setTimeout(this.loop, 1000);


};

App.prototype.onTweenComplete = function(val){
    this.mObjects.splice(3, 1);
    this.balls.shift();
    //console.log(this.mObjects)
    //clearInterval(this.mObjects);
    this.add();
};

App.prototype.add = function(){
    var rad = 50 + parseInt(150 * Math.random());
    var ball = new Ball(rad, rad, new Vector2(window.innerWidth / 2 - 200 + 400 * Math.random(), 0), new Vector2(0, 0));
    
    this.mObjects.push(ball);
    this.balls.push(ball);

    //TweenLite.to(this.balls[0], .6, {br: 0, delay: 2, ease: Expo.easeOut, onComplete: this.onTweenComplete.bind(this, this.count)});
};


App.prototype.render = function () {
    var dt = CONSTANTS.timeStep;

    // ---------------
    this.generateMotionBounds(dt);
    // ---------------

    this.contacts = this.collide();
    solver(this.contacts);


    for (var ii in this.mObjects) {
        this.mObjects[ii].update(dt);
    }

    // -------------------------
    //  draw
    // -------------------------

    this.ctx.fillStyle = "#ffffff";
    this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    for (var ii in this.mObjects) {
        this.mObjects[ii].draw(this.ctx);
    }

};

App.prototype.generateMotionBounds = function (dt) {
    for (var ii in this.mObjects) {
        this.mObjects[ii].generateMotionAABB(dt);
    }
};

App.prototype.collide = function () {
    var contacts = [];

    for (var ii = 0; ii < this.mObjects.length - 1; ii++) {
        var rigidBodyA = this.mObjects[ii];
        for (var jj = ii + 1; jj < this.mObjects.length; jj++) {
            var rigidBodyB = this.mObjects[jj];

            if (rigidBodyA.mass != 0 || rigidBodyB.mass != 0) {
                if (AABB.overlap(rigidBodyA.motionBounds, rigidBodyB.motionBounds)) {
                    var _contacts = rigidBodyA.getClosestPoints(rigidBodyB);
                    contacts = contacts.concat(_contacts);
                }
            }
        }
    }

    return contacts;
}

App.prototype.reset = function() {
  this.ctx.fillStyle = "#ffffff";
  this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
}

module.exports = App;

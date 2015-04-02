const raf = require('raf');
var App = require('./app.js');
var app;


require('domready')(() => {
  app = new App();

  var id = raf(function render(){
    app.render();

    raf(render);
  });

});

const raf = require('raf');
var App = require('./speculative-contacts-contacts-boxes/app');
var app;


require('domready')(() => {
  app = new App();

  var id = raf(function render(){
    app.render();

    id = raf(render);
  });

  document.addEventListener('keydown', function(e) {
    switch (e.keyCode) {
      case 27:
        raf.cancel(id)
        break;
      default:
    }
  });

});

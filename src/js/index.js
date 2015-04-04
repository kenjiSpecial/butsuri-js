const raf = require('raf');
var App = require('./speculative-contacts-angular-hard-case/app.js');
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

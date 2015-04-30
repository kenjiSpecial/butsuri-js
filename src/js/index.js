const raf = require('raf');
var App = require('./apps/app-case09.js');
var app;

require('domready')(() => {
  var count = 0;

  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = 'http://fonts.googleapis.com/css?family=Roboto:700';
  document.getElementsByTagName('head')[0].appendChild(link);

  // Trick from http://stackoverflow.com/questions/2635814/
  var id;
  var image = new Image;
  image.src = link.href;
  image.onerror = function() {
    app = new App();

    id = raf(function render(){
      app.render();

      id = raf(render);
    });
  };

  document.addEventListener('keydown', function(e) {
    switch (e.keyCode) {
      case 27:
        if(count == 0){
          raf.cancel(id)
        }else{
          app.reset();
        }

        count++;
        break;
      default:
    }
  });

});

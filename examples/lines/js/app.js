window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

var App = {
    init: function() {
        App.cvs = document.getElementById('canvas');
        App.ctx = App.cvs.getContext('2d');
        App.cvs.width = 640;
        App.cvs.height = 480;
        App.timeNow = App.timePrevious = (new Date()).getTime();

        App.line = new vv.Line(0, 0, 640, 480);
        App.line.addState('state_2', 640, 0, 0, 480);

        $('li.button').on('click', function() {
            App.line.setState($(this).data('state'));
            $('li.active').removeClass('active');
            $(this).addClass('active');
        })

        App.loop();
    },

    loop: function() {
        requestAnimFrame(App.loop);

        App.ctx.clearRect(0, 0, App.cvs.width, App.cvs.height);
        App.line.draw(App.ctx);
    }
};

window.onload = function(){ App.init(); };

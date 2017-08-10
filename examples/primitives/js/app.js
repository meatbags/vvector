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
        // set up canvas

        App.cvs = document.getElementById('canvas');
        App.ctx = App.cvs.getContext('2d');
        App.cvs.width = 400;
        App.cvs.height = 400;

        // create shapes & add states

        App.line = new vv.Line(100, 200, 300, 200);
        App.line.addState('state_2', 150, 200, 250, 200);
        App.line.addState('state_3', 200, 150, 200, 250);

        App.bezier = new vv.Bezier(0, 200, 100, 100, 300, 100, 400, 200);
        App.bezier.addState('state_2', 0, 200, 100, 300, 300, 300, 400, 200);
        App.bezier.addState('state_3', 0, 200, 100, 100, 300, 100, 400, 200);

        App.rect = new vv.Rect(150, 150, 100, 100);
        App.rect.addState('state_2', 180, 200, 40, 40);
        App.rect.addState('state_3', 200, 180, 60, 40);

        App.arc = new vv.Arc(200, 200, 100, Math.PI * 0.5, Math.PI * 2.5);
        App.arc.addState('state_2', 200, 200, 50, Math.PI, Math.PI * 2);
        App.arc.addState('state_3', 200, 200, 50, Math.PI * 0.5, Math.PI * 1.5);

        // change state on button press

        $('li.button').on('click', function() {
            var state = $(this).data('state');

            App.line.setState(state);
            App.bezier.setState(state);
            App.rect.setState(state);
            App.arc.setState(state);

            $('li.active').removeClass('active');
            $(this).addClass('active');
        })

        // run loop

        App.loop();
    },

    loop: function() {
        requestAnimFrame(App.loop);

        // clear canvas

        App.ctx.clearRect(0, 0, App.cvs.width, App.cvs.height);

        // draw shapes

        App.line.draw(App.ctx);
        App.bezier.draw(App.ctx);
        App.rect.draw(App.ctx);
        App.arc.draw(App.ctx);
    }
};

window.onload = function(){ App.init(); };

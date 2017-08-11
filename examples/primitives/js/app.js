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

        App.rect = new vv.Rect(150, 150, 100, 100);
        App.rect.addState('state_2', 180, 200, 40, 40);
        App.rect.addState('state_3', 200, 180, 60, 40);

        App.arc = new vv.Arc(200, 200, 100, Math.PI * 0.5, Math.PI * 2.5);
        App.arc.addState('state_2', 200, 200, 50, Math.PI, Math.PI * 2);
        App.arc.addState('state_3', 200, 200, 50, Math.PI * 0.5, Math.PI * 1.5);

        App.bezier = new vv.Bezier(0, 200, 100, 100, 300, 100, 400, 200);
        App.bezier.addState('state_2', 0, 200, 100, 300, 300, 300, 400, 200);
        App.bezier.addState('state_3', 0, 0, 0, 200, 400, 200, 400, 400);

        // change state on button press

        App.loopers = [];

        for (var i=0; i<20; i+=1) {
            var L = new  vv.Line(20 * i, 10, 20 * i, 20, {easing:'ease-linear', automation:'loop', time: 1});
            L.addState('', 20 * (i + 1), 10, 20 * (i + 1), 20);
            App.loopers.push(L);
        }

        App.osc = new vv.Line(0, 0, 400, 400, {automation: 'oscillate', time: 1});
        App.osc.addState('foo', 0, 200, 400, 200);
        App.osc.addState('foo', 0, 400, 400, 0);

        $('li.button').on('click', function() {
            var state = $(this).data('state');

            App.line.setState(state);
            App.rect.setState(state);
            App.arc.setState(state);
            App.bezier.setState(state);

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
        App.ctx.fillStyle = '#eee';

        // draw shapes

        App.line.draw(App.ctx);
        App.rect.draw(App.ctx, true, true);
        App.arc.draw(App.ctx);
        App.bezier.draw(App.ctx);

        // test new functions

        for (var i=0; i<App.loopers.length; i++)
            App.loopers[i].draw(App.ctx);

        App.osc.draw(App.ctx);
    }
};

window.onload = function(){ App.init(); };

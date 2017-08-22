var scene, circle;

// create a new scene
scene = new vv.Scene('my_canvas', {width: 200, height: 200});

// add a circle with some animated states
circle = new vv.Arc(100, 100, 20, 0, Math.PI * 2, {
    automation: 'oscillate',
    easing: 'ease-in-and-out',
    time: 1,
    strokeStyle: 'black',
    fillStyle: 'yellow',
    lineWidth: 2
});
circle.addState('state_2', 100, 100, 50, 0, Math.PI * 2);
scene.add(circle);

// run!
scene.loop();

/*
var App = {
    init: function() {
        // set up scene

        App.scene = new vv.Scene('my_canvas_id', {width: 400, height: 400});

        // create shapes & add states

        App.line = new vv.Line(100, 200, 300, 200, {
          lineWidth: 10,
          strokeStyle: '#f00'
        });
        App.line.addState('state_2', 150, 200, 250, 200);
        App.line.addState('state_3', 200, 150, 200, 250);

        App.rect = new vv.Rect(150, 150, 100, 100, {
            lineWidth: 2,
            strokeStyle: '#f00',
            fillStyle: '#fa4'
        });
        App.rect.addState('state_2', 180, 200, 40, 40);
        App.rect.addState('state_3', 200, 180, 60, 40);

        App.arc = new vv.Arc(200, 200, 100, Math.PI * 0.5, Math.PI * 2.5, {
            lineWidth: 4,
            strokeStyle: '#222',
            fillStyle: '#888'
        });
        App.arc.addState('state_2', 200, 200, 50, Math.PI, Math.PI * 2);
        App.arc.addState('state_3', 200, 200, 50, Math.PI * 0.5, Math.PI * 1.5);

        App.bezier = new vv.Bezier(0, 200, 100, 100, 300, 100, 400, 200, {
          lineWidth: 4,
          strokeStyle: '#00f',
          fillStyle: '#044'
        });
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

        // add to scene
        App.scene.add(
            App.line,
            App.rect,
            App.arc,
            App.bezier
        );

        // run loop
        App.scene.loop();
    }
};

App.init();

*/

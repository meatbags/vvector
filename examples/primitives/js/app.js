var scene, circle, line, rect, bez;

// create a new scene
scene = new vv.Scene('my_canvas', {width: 200, height: 200});

// create a circle with animated states
circle = new vv.Arc({x: 100, y: 100, radius: 20, fillStyle: 'yellow', lineWidth: 2});
circle.addState({label: '?', radius: 50});
circle.setAnimation({
  automation: 'oscillate',
  easing: 'ease-in-and-out',
  time: 3
});

line = new vv.Line({
  x1: 0, y1: 0, x2: 100, y2: 100, lineWidth: 10, automation: 'oscillate', time: 2
})
line.addState({strokeStyle:0xff0000, lineWidth: 20})

bez = new vv.Bezier({
  x1: 0,
  y1: 50,
  x2: 400,
  y2: 50,
  automation: 'loop',
  strokeStyle: 'blue',
  time: 10,
  lineWidth: 8,
  fillStyle: 'green'
});
bez.addState({fillStyle: 'red', lineWidth: 4, cp1x: 300});

rect = new vv.Rect({
  automation: 'loop', fillStyle: 'black', x: 100, y: 100, width: 200, height: 100, lineWidth: 10, strokeStyle: 0x00ff00
})

rect.addState({strokeStyle: 'red', fillStyle: 'white'})

// add to scene
scene.add(circle);

// run!
scene.loop();

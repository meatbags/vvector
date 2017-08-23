# vvector

Animate and automate Canvas primitives. Light-weight. No-nonsense. Martinis.

## use

Get the [minified library](https://github.com/meatbags/vvector/tree/master/build) and include it in your project.

```html
<script type='text/javascript' src='./path/to/vvector.min.js'></script>
```

Create an animation with ease!
```javascript
var scene, circle;

// create a scene
scene = new vv.Scene('my_canvas', {width: 200, height: 200});

// create a circle with some states
circle = new vv.Arc(100, 100, 20, 0, Math.PI * 2, {
    strokeStyle: 'black',
    fillStyle: 'yellow',
    lineWidth: 2,
    automation: 'oscillate',
    easing: 'ease-in-and-out',
    time: 1
});
circle.addState('state_2', 100, 100, 50, 0, Math.PI * 2);

// add to scene
scene.add(circle);

// run!
scene.loop();
```

![Alt text](/images/test_01.gif?raw=true)

## documentation

* [Scene](#scene)
* [Line](#line)
* [Bezier](#bezier)
* [Rect](#rect)
* [Arc](#arc)

### Scene(id, [params])

..id ```string``` ```required```
....Id of the canvas element. If none exists, it will be created.

..params ```object```
....width ```number```
......Width of the canvas in pixels.
....height ```number```
......Height of the canvas in pixels.

## build

```
git clone https://github.com/meatbags/vvector
npm install
npm run build
```

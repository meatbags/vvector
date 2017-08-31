# vvector

Animate and automate Canvas primitives. Light-weight. No-nonsense. Martinis.

## use

Get the [minified library](https://github.com/meatbags/vvector/tree/master/build) and include it in your project.

```html
<script type='text/javascript' src='./path/to/vvector.min.js'></script>
```

A simple scene example:
```javascript
var scene, circle;

// create a new scene
scene = new vv.Scene('my_canvas', {width: 600, height: 200});

// create a circle
circle = new vv.Arc({x: 100, y: 100, radius: 20, fillStyle: 'yellow', automation: 'oscillate', easing: 'ease-in-and-out', lineWidth: 2});

// add an new animation state
circle.addState({radius: 50});

// add to scene
scene.add(circle);

// run!
scene.loop();
```

![Alt text](/images/test_01.gif?raw=true)

## build

```
git clone https://github.com/meatbags/vvector
npm install
npm run build
```

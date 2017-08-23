# vvector

Animate and automate Canvas primitives. Light-weight. No-nonsense. Martinis.

## documentation
#### Scene(id, [params])

id ```string``` ```required```  
...ID of the canvas element. If nonexistant, it will be created.

params ```object```
...width ```number```  
......Width of the canvas in pixels.  
...height ```number```  
......Height of the canvas in pixels.

#### Line(x1, y1, x2, y2, [params])

x1, y1, x2, y2 ```number``` ```required```  
...Coordinates of the start and end of the line.  
params ```object```  
...strokeStyle ```string``` ```#000```  
......Stroke colour.  
...fillStyle ```string``` ```#fff```  
......Fill colour.  
...lineWidth ```number``` ```1```  
......Stroke width.  
...percentageCoords ```boolean``` ```false```  
......Coordinates are percentage of canvas dimensions.  
...automation ```string```  
......Set type of automation. Possible values: ```loop``` ```oscillate```  
...easing ```string``` ```ease-linear```
......Type of easing. Possible values: ```ease-linear``` ```ease-in``` ```ease-out``` ```ease-in-and-out```
...time ```number```  
......Duration of animation.


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

## build

```
git clone https://github.com/meatbags/vvector
npm install
npm run build
```

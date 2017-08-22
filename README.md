# vvector

Animate and automate Canvas primitives. Light-weight. No-nonsense. Martinis.

## usage

Get vvector
[https://github.com/meatbags/vvector/tree/master/build](https://github.com/meatbags/vvector/tree/master/build)

It's as easy as 1, 2, 3!
```
var scene, circle;

// 1. create a scene
scene = new vv.Scene('my_canvas', {width: 200, height: 200});

// 2. add a circle with some styles
circle = new vv.Arc(100, 100, 20, 0, Math.PI * 2, {
    strokeStyle: 'black',
    fillStyle: 'yellow',
    lineWidth: 2,
    automation: 'oscillate',
    easing: 'ease-in-and-out',
    time: 1
});
circle.addState('state_2', 100, 100, 50, 0, Math.PI * 2);
scene.add(circle);

// 3. run!
scene.loop();
```

![Alt text](/images/test_01.gif?raw=true)

## build

```
git clone https://github.com/meatbags/vvector
npm install
npm run build
```

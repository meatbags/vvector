# vvector

Animate and automate Canvas primitives. Light-weight. No-nonsense.

## build

```
git clone https://github.com/meatbags/vvector
npm install
npm run build
```

## usage

```
var cvs = document.createElement('canvas'),
    ctx = cvs.getContext('2d'),
    pulse = new vv.Arc(cvs.width/2, cvs.height/2, 20, 0, Math.PI*2, {automation: 'oscillate'});

pulse.addState('foo', cvs.width/2, cvs.height/2, 40, 0, Math.PI*2);

function loop() {
    requestAnimationFrame(loop);
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    pulse.draw(ctx);
}

document.body.append(cvs);
loop();
```

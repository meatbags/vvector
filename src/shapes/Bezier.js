import { Point } from './Point.js';

function Bezier(x1, y1, cp1x, cp1y, cp2x, cp2y, x2, y2, params) {
    if (typeof(params) === 'undefined') {
        var params = {};
    }

    this.animationTime = params.animationTime || 1.0;
    this.easing = params.easing || 'ease-linear';
    this.p1 = new Point(x1, y1);
    this.p2 = new Point(x2, y2);
    this.cp1 = new Point(cp1x, cp1y);
    this.cp2 = new Point(cp2x, cp2y);
    this.state = {
        current: 'default',
        'default': {
            p1: new Point(x1, y1),
            p2: new Point(x2, y2),
            cp1: new Point(cp1x, cp1y),
            cp2: new Point(cp2x, cp2y)
        }
    };
}

Bezier.prototype = {
    draw: function(ctx) {
        this.p1.update(this.animationTime, this.easing);
        this.p2.update(this.animationTime, this.easing);
        this.cp1.update(this.animationTime, this.easing);
        this.cp2.update(this.animationTime, this.easing)
        ctx.beginPath();
        ctx.moveTo(this.p1.x, this.p1.y);
        ctx.bezierCurveTo(this.cp1.x, this.cp1.y, this.cp2.x, this.cp2.y, this.p2.x, this.p2.y);
        ctx.stroke();
    },

    addState: function(label, x1, y1, cp1x, cp1y, cp2x, cp2y, x2, y2, params) {
        this.state[label] = {
            p1: new Point(x1, y1),
            p2: new Point(x2, y2),
            cp1: new Point(cp1x, cp1y),
            cp2: new Point(cp2x, cp2y)
        }
    },

    setState: function(label) {
        if (this.state.current !== label &&  this.state[label]) {
            var target =  this.state[label];

            this.state.current = (this.state[label]) ? label : 'default';
            this.p1.setTarget(target.p1);
            this.p2.setTarget(target.p2);
            this.cp1.setTarget(target.cp1);
            this.cp2.setTarget(target.cp2);
        }
    }
};

export { Bezier };

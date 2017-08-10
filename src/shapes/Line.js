import { Point } from './Point.js';

function Line(x1, y1, x2, y2) {
    this.p1 = new Point(x1, y1);
    this.p2 = new Point(x2, y2);
    this.state = {
        'default': {
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2
        }
    }
}

Line.prototype = {
    update: function(rate) {
        this.p1.update(rate);
        this.p2.update(rate);
    },

    stroke: function(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.p1.x, this.p1.y);
        ctx.lineTo(this.p2.x, this.p2.y);
        ctx.stroke();
    },

    addState: function(label, x1, y1, x2, y2, params) {
        this.state[label] = {
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2
        }
    },

    setState: function(label) {
        var target = this.state[label] || this.state['default'];

        this.p1.setTarget(target.x1, target.y1);
        this.p2.setTarget(target.x2, target.y2);
    }
};

export { Line };

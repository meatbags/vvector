import { Point } from './Point.js';

function Line(x1, y1, x2, y2, params) {
    if (typeof(params) === 'undefined') {
        var params = {};
    }

    this.p1 = new Point(x1, y1);
    this.p2 = new Point(x2, y2);
    this.state = {
        current: 'default',
        'default': {
            p1: new Point(x1, y1),
            p2: new Point(x2, y2)
        }
    };

    this.animationTime = params.animationTime || 1.0;
    this.easing = params.easing || 'ease-linear';
    this.percentage = params.percentageCoords || false;
}

Line.prototype = {
    draw: function(ctx) {
        this.p1.update(this.animationTime, this.easing);
        this.p2.update(this.animationTime, this.easing);

        ctx.beginPath();

        if (!this.percentage) {
            ctx.moveTo(this.p1.x, this.p1.y);
            ctx.lineTo(this.p2.x, this.p2.y);
        } else {
            var w = ctx.canvas.width;
            var h = ctx.canvas.height;
            
            ctx.moveTo(this.p1.x * w, this.p1.y * h);
            ctx.lineTo(this.p2.x * w, this.p2.y * h);
        }
        ctx.stroke();
    },

    addState: function(label, x1, y1, x2, y2, params) {
        this.state[label] = {
            p1: new Point(x1, y1),
            p2: new Point(x2, y2)
        }
    },

    setState: function(label) {
        if (this.state.current !== label) {
            var target = this.state[label] || this.state['default'];

            this.state.current = (this.state[label]) ? label : 'default';
            this.p1.setTarget(target.p1);
            this.p2.setTarget(target.p2);
        }
    }
};

export { Line };

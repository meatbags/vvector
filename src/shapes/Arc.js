import { Point } from './Point.js';

function Arc(x, y, radius, startAngle, stopAngle) {
    if (typeof(params) === 'undefined') {
        var params = {};
    }

    this.p1 = new Point(x, y);
    this.radius = new Point(radius, 0);
    this.angle = new Point(startAngle, stopAngle);

    this.state = {
        current: 'default',
        'default': {
            p1: new Point(x, y),
            radius: new Point(radius, 0),
            angle: new Point(startAngle, stopAngle)
        }
    };

    this.animationTime = params.animationTime || 1.0;
    this.easing = params.easing || 'ease-linear';
    this.percentage = params.percentageCoords || false;
}

Arc.prototype = {
    draw: function(ctx) {
        this.p1.update(this.animationTime, this.easing);
        this.radius.update(this.animationTime, this.easing);
        this.angle.update(this.animationTime, this.easing);
        ctx.beginPath();

        if (!this.percentage) {
            ctx.arc(this.p1.x, this.p1.y, this.radius.x, this.angle.x, this.angle.y, false);
        } else {
            var w = ctx.canvas.width;
            var h = ctx.canvas.height;

            ctx.arc(this.p1.x * w, this.p1.y * h, this.radius.x * w, this.angle.x, this.angle.y, false);
        }

        ctx.stroke();
    },

    addState: function(label, x, y, radius, startAngle, stopAngle, params) {
        this.state[label] = {
            p1: new Point(x, y),
            radius: new Point(radius, 0),
            angle: new Point(startAngle, stopAngle)
        };
    },

    setState: function(label) {
        if (this.state.current !== label) {
            var target = this.state[label] || this.state['default'];

            this.state.current = (this.state[label]) ? label : 'default';
            this.p1.setTarget(target.p1);
            this.radius.setTarget(target.radius);
            this.angle.setTarget(target.angle);
        }
    }
}

export { Arc };

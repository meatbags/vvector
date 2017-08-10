import { Point } from './Point.js';

function Rect(x, y, width, height, params) {
    if (typeof(params) === 'undefined') {
        var params = {};
    }

    this.p1 = new Point(x, y);
    this.dimensions = new Point(width, height)
    this.state = {
        current: 'default',
        'default': {
            p1: new Point(x, y),
            dimensions: new Point(width, height)
        }
    };

    this.animationTime = params.animationTime || 1.0;
    this.easing = params.easing || 'ease-linear';
    this.percentage = params.percentageCoords || false;
}

Rect.prototype = {
    draw: function(ctx) {
        this.p1.update(this.animationTime, this.easing);
        this.dimensions.update(this.animationTime, this.easing);

        if (!this.percentage) {
            ctx.strokeRect(this.p1.x, this.p1.y, this.dimensions.x, this.dimensions.y);
        } else {
            var w = ctx.canvas.width;
            var h = ctx.canvas.height;

            ctx.strokeRect(this.p1.x * w, this.p1.y * h, this.dimensions.x * w, this.dimensions.y * h);    
        }
    },

    addState: function(label, x, y, width, height, params) {
        this.state[label] = {
            p1: new Point(x, y),
            dimensions: new Point(width, height)
        }
    },

    setState: function(label) {
        if (this.state.current !== label) {
            var target = this.state[label] || this.state['default'];

            this.state.current = (this.state[label]) ? label : 'default';
            this.p1.setTarget(target.p1);
            this.dimensions.setTarget(target.dimensions);
        }
    }
}

export { Rect };

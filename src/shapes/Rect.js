import { Point } from './Point.js';

function Rect(x, y, width, height, params) {
    if (typeof(params) === 'undefined') {
        var params = {};
    }

    this.animationTime = params.animationTime || 1.0;
    this.easing = params.easing || 'ease-linear';
    this.p1 = new Point(x, y);
    this.dimensions = new Point(width, height)
    this.state = {
        current: 'default',
        'default': {
            p1: new Point(x, y),
            dimensions: new Point(width, height)
        }
    };
}

Rect.prototype = {
    draw: function(ctx) {
        this.p1.update(this.animationTime, this.easing);
        this.dimensions.update(this.animationTime, this.easing);
        ctx.strokeRect(this.p1.x, this.p1.y, this.dimensions.x, this.dimensions.y);
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

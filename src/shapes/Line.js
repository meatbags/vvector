import { Point } from './Point.js';
import { Animation } from '../core/Animation.js';

function Line(x1, y1, x2, y2, params) {
    if (typeof(params) === 'undefined') {
        var params = {};
    }

    // coordinates
    this.p1 = new Point(x1, y1);
    this.p2 = new Point(x2, y2);

    // settings
    this.percentage = params.percentageCoords || false;

    // animation
    Animation.call(
        this,
        params.time || 1.0,
        params.easing || 'ease-linear',
        params.automation || false,
        {
            label: 'default',
            p1: new Point(x1, y1),
            p2: new Point(x2, y2)
        }
    );
}

Line.prototype = Object.create(Animation.prototype);
Line.prototype.constructor = Line;

Line.prototype.draw = function(ctx) {
    this.updateAnimation();
    this.p1.update(this.time);
    this.p2.update(this.time);
    
    ctx.beginPath();
    if (!this.percentage) {
        ctx.moveTo(this.p1.x, this.p1.y);
        ctx.lineTo(this.p2.x, this.p2.y);
    } else {
        ctx.moveTo(this.p1.x * ctx.canvas.width, this.p1.y * ctx.canvas.height);
        ctx.lineTo(this.p2.x * ctx.canvas.width, this.p2.y * ctx.canvas.height);
    }
    ctx.stroke();
};

Line.prototype.addState = function(label, x1, y1, x2, y2) {
    // add state
    this.pushState({
        label: label,
        p1: new Point(x1, y1),
        p2: new Point(x2, y2)
    });
};

export { Line };

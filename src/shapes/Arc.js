import { Point } from './Point.js';
import { Animation } from '../core/Animation.js';

function Arc(x, y, radius, startAngle, stopAngle, params) {
    if (typeof(params) === 'undefined') {
        var params = {};
    }

    // coordinates
    this.p1 = new Point(x, y);
    this.radius = new Point(radius, 0);
    this.angle = new Point(startAngle, stopAngle);

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
            p1: new Point(x, y),
            radius: new Point(radius, 0),
            angle: new Point(startAngle, stopAngle)
        }
    );
}

Arc.prototype = Object.create(Animation.prototype);
Arc.prototype.constructor = Arc;

Arc.prototype.draw = function(ctx, stroke, fill) {
    this.updateAnimation();
    this.p1.update(this.time);
    this.radius.update(this.time);
    this.angle.update(this.time);

    ctx.beginPath();
    if (!this.percentage) {
        ctx.arc(this.p1.x, this.p1.y, this.radius.x, this.angle.x, this.angle.y, false);
    } else {
        ctx.arc(this.p1.x * ctx.canvas.width, this.p1.y * ctx.canvas.height, this.radius.x * ctx.canvas.width, this.angle.x, this.angle.y, false);
    }
    if (fill)
        ctx.fill();
    if (typeof(stroke) === 'undefined' || stroke)
        ctx.stroke();
};

Arc.prototype.addState = function(label, x, y, radius, startAngle, stopAngle) {
    // add state
    this.pushState({
        label: label,
        p1: new Point(x, y),
        radius: new Point(radius, 0),
        angle: new Point(startAngle, stopAngle)
    });
};

export { Arc };
